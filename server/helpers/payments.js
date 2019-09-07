const { json, send } = require("micro");
const stripe = require("stripe")(process.env.STRIPE_SECRET_DEV);
const axios = require("axios");
const { parse } = require("url");
const connect = require("./db");
const ObjectId = require('mongodb').ObjectID;
const redirect = require('micro-redirect')
const cors = require('micro-cors')()

const dispatchTicket = (token, quantity) => {
  const headers = {
    Authorization: "Token " + process.env.GUEST_PASS_KEY,
    "Content-Type": "application/json"
  };
  var tickets = []
  for (var i = 0;i<quantity;i++){
    var tix =  axios({
      method: "post",
      url: "https://app.guestmanager.com/api/public/v2/tickets",
      data: {
        ticket: {
          event_ticket_type_id: 26926,
          name: token.card.name,
          email: token.email,
          dispatch: true
        }
      },
      headers: headers
    }).then((ticket)=>{
      console.log(ticket.data)
    }).catch((err)=>{
      console.log(err)
    })
    tickets.push(tix)
  }
  return Promise.all(tickets)
};
const stripeChargeCallback = (res, metadata) => async (err, charge) => {
  console.log(metadata)
  if (err) {
    console.log(err)
    send(res, 500, { error: err });
  } else {
    const collection = await (await connect()).collection('tba')
    const obj = {}
    for(var tix in metadata){
      if (tix === "eventId" || tix === "updatedAt") continue
      const key = `ticketTypes.${tix}.currentQuantity`
      obj[key] = -metadata[tix]
    }
    const charges = []
    await stripe.charges.list({limit: 100, created:{gt:metadata.updatedAt}}).autoPagingEach(function(customer) {
      charges.push(customer)
      console.log(customer.created)
    })
    await collection.findOneAndUpdate({_id: ObjectId(metadata.eventId)},{$inc:obj, $push: {"tickets": { $each: charges, $position: 0}}, $set: {"updatedAt": parseInt(new Date() /1000)}},{returnNewDocument:true})
    redirect(res, 200, `/event/${metadata.eventId}/confirmation`)
  }
};
const ticketApi = async (req, res) => {
  const data = await json(req);
  console.log(data)
  const body = {
    source: data.token.id,
    amount: data.amount,
    currency: "usd",
    metadata: data.metadata
  };
  stripe.charges.create(body, stripeChargeCallback(res, body.metadata));
};
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
