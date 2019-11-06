const { json, send } = require("micro");
const stripe = require("stripe")(process.env.STRIPE_SECRET_DEV);
const axios = require("axios");
const { parse } = require("url");
const connect = require("./db");
const ObjectId = require('mongodb').ObjectID;
const redirect = require('micro-redirect')
const cors = require('micro-cors')()

const wrapAsync = handler => (req, res) => handler(req)
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error: error.message }))

    const dispatchTicket = async (eventCheckout) => {
      var tickets = []
      let quantity = 0
      let ticketId = ""
      for (var item in eventCheckout.cart){
        quantity = eventCheckout.cart[item].quantity
        ticketId = eventCheckout.cart[item].id
        for (var i = 0;i<quantity;i++){
          tickets.push(
            axios({
              method: "post",
              url: "https://app.guestmanager.com/api/public/v2/tickets",
              data: {
                ticket: {
                  ticket_type_id: ticketId,
                  event_id: eventCheckout.guestId,
                  name: `${eventCheckout.firstName} ${eventCheckout.lastName}`,
                  email: eventCheckout.emailAddress,
                  dispatch: true
                }
              },
              headers
            }).then((ticket)=>{
              console.log("ticket success")
              console.log(ticket)
            }).catch((err)=>{
              console.log("err")
              console.log(err)
            })
          )
        }
      }    
      await Promise.all(tickets)
    };

const updateTixCount = async (cart, eventId, charges) => {
  console.log('charges get', charges)
  const obj = {}
  for(var tix in cart){
    const key = `ticketTypes.${tix}.currentQuantity`
    obj[key] = -cart[tix]
  }
  return await db.collection('tba').findOneAndUpdate(
    {_id: ObjectId(eventId)},
    {
      $inc:obj, 
      $push: {"tickets": { $each: charges, $position: 0}}, 
      $set: {"updatedAt": parseInt(new Date() /1000)}
    })
}


const ticketApi =  wrapAsync(async (req) => {
  try {
    const charges = []
    const body = await json(req)
    console.log(body)
    let { eventCheckout, token } = body
    let cart = {}
    for (let tix in eventCheckout.cart){
      cart[tix] = eventCheckout.cart[tix].quantity
    }
    delete eventCheckout.cart
    const obj = {
      ...eventCheckout,
      ...cart,
    }
    charges.push(await stripe.charges.create({
      amount: eventCheckout.total,
      currency: "usd",
      description: `TBA Ticket - ${eventCheckout.title}`,
      source: token.id,
      metadata: obj
    }));
    const event =  await updateTixCount(cart, eventCheckout.eventId, charges)
    dispatchTicket(eventCheckout)
    return event
  } catch (err) {
    console.log(err);
    return err
  }
});

const updateAndSaveApi = async (id, list) => {
   console.log("update: "+id)
   // Connect to MongoDB and get the database
   const database = await connect()
   const collection = await database.collection('tba')
   console.log('updating' + list.length)
   let result = await collection.findOneAndUpdate({_id:ObjectId(id)},{$set: {"tickets":list}},{returnNewDocument: true})
   console.log("updated:");
   console.log(result)

}
const updateApi = async (req, res) =>{
  let event = json(req)
  let charges = []
  await stripe.charges.list({limit:100, created:{$gt:event.updatedAt}}).autoPagingEach((customer)=>{
    charges.push(customer)
  })
  const database = await connect()
  const collection = await database.collection('tba')
  console.log('updating')
  let result = await collection.findOneAndUpdate(
    {
      _id:ObjectId(event._id)
    },
    {
      $push: {"tickets":charges}
    },
    {
      returnNewDocument: true
    }
)

 send(res,200,result)
}
const balanceApi = async (req, res)  => { 
  const { query } = parse(req.url, true);
  const collection = await connect().collection('tba')

  const event = await collection.findOne({_id: ObjectId(query.id)})
  send(res, 200, event)
}

const bankValidation = async (res, req) => {
  const bankInfo = await json(req)
  stripe.tokens.create({
    bank_account: {
      country: 'US',
      currency: 'usd',
      account_holder_name: bankInfo.fullName,
      account_holder_type: 'individual',
      routing_number: bankInfo.routingNumber,
      account_number: bankInfo.accountNumber
    }
  }, function(err, token) {
    // asynchronously called
  });
}

const createAccount = async (req, res) => {
  const account =  await stripe.accounts.create({
    country: 'US',
    type: 'custom',
    requested_capabilities: ['card_payments'],
  });
  send(res, 200, account)
}
module.exports = {
  ticketApi,
  createAccount,
  balanceApi : cors(balanceApi),
  updateAndSaveApi
};
