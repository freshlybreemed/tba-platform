const { json, send } = require("micro");
const stripe = require("stripe")(process.env.STRIPE_SECRET_DEV);
const axios = require("axios");
const { parse } = require("url");
const connect = require("./db");
const ObjectId = require("mongodb").ObjectID;
const cors = require("micro-cors")();
const { wrapAsync } = require("../handlers/lib");

const headers = {
  Authorization: `Token ${process.env.REACT_APP_GUEST_PASS_KEY}`,
  "Content-Type": "application/json"
};

const dispatchTicket = async eventCheckout => {
  var tickets = [];
  let quantity = 0;
  let ticketId = "";
  let guestmanager = [];
  for (var item in eventCheckout.cart) {
    quantity = eventCheckout.cart[item].quantity;
    ticketId = eventCheckout.cart[item].id;
    for (var i = 0; i < quantity; i++) {
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
              dispatch: false
            }
          },
          headers
        })
          .then(ticket => {
            console.log("ticket success");
            console.log(ticket);
            guestmanager.push(ticket.data);
          })
          .catch(err => {
            console.log("err");
            console.log(err);
          })
      );
    }
  }
  await Promise.all(tickets);
  return guestmanager;
};

const updateTixCount = async (cart, eventId, charges, guestInfo) => {
  const obj = {};
  for (var tix in cart) {
    const key = `ticketTypes.${tix}.currentQuantity`;
    obj[key] = -cart[tix];
  }
  console.log("beans", Object.assign({}, charges[0], { guestInfo }));
  const db = await connect();
  return await db.collection("tba").findOneAndUpdate(
    { _id: ObjectId(eventId) },
    {
      $inc: obj,
      $push: {
        tickets: {
          $each: [Object.assign({}, charges[0], { guestInfo })],
          $position: 0
        }
      },
      $set: { updatedAt: parseInt(new Date() / 1000) }
    }
  );
};

const ticketApi = wrapAsync(async (req, db) => {
  try {
    const charges = [];
    const body = await json(req);
    console.log(body);
    let { eventCheckoutForm, token } = body;
    let cart = {};
    for (let tix in eventCheckoutForm.cart) {
      cart[tix] = eventCheckoutForm.cart[tix].quantity;
    }
    const obj = {
      ...eventCheckoutForm,
      ...cart
    };
    delete obj.cart;
    obj.status = "Successfully purchased";
    charges.push(
      await stripe.charges.create({
        amount: eventCheckoutForm.total * 100,
        currency: "usd",
        description: `TBA Ticket - ${eventCheckoutForm.title}`,
        source: token.id,
        metadata: obj
      })
    );
    const guestInfo = await dispatchTicket(eventCheckoutForm);
    const event = await updateTixCount(
      cart,
      eventCheckoutForm.eventId,
      charges,
      guestInfo
    );
    return event;
  } catch (err) {
    console.log(err);
    return err;
  }
});

const updateAndSaveApi = async (id, list) => {
  console.log("update: " + id);
  // Connect to MongoDB and get the database
  const database = await connect();
  const collection = await database.collection("tba");
  console.log("updating" + list.length);
  let result = await collection.findOneAndUpdate(
    { _id: ObjectId(id) },
    { $set: { tickets: list } },
    { returnNewDocument: true }
  );
  console.log("updated:");
  console.log(result);
};
const updateApi = wrapAsync(async (req, db) => {
  let event = json(req);
  let charges = [];
  await stripe.charges
    .list({ limit: 100, created: { $gt: event.updatedAt } })
    .autoPagingEach(customer => {
      charges.push(customer);
    });
  let result = await db.collection.findOneAndUpdate(
    {
      _id: ObjectId(event._id)
    },
    {
      $push: { tickets: charges }
    },
    {
      returnNewDocument: true
    }
  );

  return result;
});
const balanceApi = async (req, res) => {
  const { query } = parse(req.url, true);
  const collection = await connect().collection("tba");

  const event = await collection.findOne({ _id: ObjectId(query.id) });
  send(res, 200, event);
};

const bankValidation = async (res, req) => {
  const bankInfo = await json(req);
  stripe.tokens.create(
    {
      bank_account: {
        country: "US",
        currency: "usd",
        account_holder_name: bankInfo.fullName,
        account_holder_type: "individual",
        routing_number: bankInfo.routingNumber,
        account_number: bankInfo.accountNumber
      }
    },
    function(err, token) {
      // asynchronously called
    }
  );
};

const createAccount = async (req, res) => {
  const account = await stripe.accounts.create({
    country: "US",
    type: "custom",
    requested_capabilities: ["card_payments"]
  });
  send(res, 200, account);
};
module.exports = {
  ticketApi,
  createAccount,
  balanceApi: cors(balanceApi),
  updateAndSaveApi
};
