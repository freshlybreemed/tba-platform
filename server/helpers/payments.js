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
   const database = await connect()
   const collection = await database.collection('tba')
  for(var tix in metadata){
      console.log(tix)
      if (tix === "eventId") continue
      const key = `ticketTypes.${tix}.currentQuantity`
      const obj = {}
      obj[key] = -metadata[tix]
      console.log( await collection.findOneAndUpdate({_id: ObjectId(metadata.eventId)},{$inc:obj},{returnNewDocument:true}))
    }
   redirect(res, 200, `/event/${metadata.eventId}/confirmation`)
  }
};
const ticketApi = async (req, res) => {
  const data = await json(req);
  const body = {
    source: data.token.id,
    amount: data.amount,
    currency: "usd",
    metadata: data.metadata
  };
  console.log(body)
  stripe.charges.create(body, stripeChargeCallback(res, body.metadata));
};
const updateAndSaveApi = async (res, id, list) => {

   // Connect to MongoDB and get the database
   const database = await connect()

   // Select the "tba" collection from the database
   const collection = await database.collection('tba')
   console.log(list)
   console.log('updating')
   // Respond with a JSON string of all users in the collection
   let result = await collection.findOneAndUpdate({_id:ObjectId(id)},{$set: {"tickets":list}},{returnNewDocument: true})
   send(res, 200,result);

}
const balanceApi = async (req, res)  => { 
  // Get events
  const { query } = parse(req.url, true);
  var count = 0
  var charges = []
  await stripe.charges.list({limit: 100}).autoPagingEach(function(customer) {
    // Do something with customer
    count++
    charges.push(customer)
    // console.log(customer)
  }).then(()=>updateAndSaveApi(res, query.id, charges))
  
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
  getEventApi: cors(getEventApi),
  balanceApi : cors(balanceApi)
};
