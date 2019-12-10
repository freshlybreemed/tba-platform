const axios = require("axios");
const https = require("https");

var cloudinary = require("cloudinary").v2;
const { ObjectId } = require("mongodb");
const { json } = require("micro");
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_DEV);
const REACT_APP_GUEST_PASS_KEY = process.env.REACT_APP_GUEST_PASS_KEY;

//Enter your credentials below
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const headers = {
  Authorization: `Token ${REACT_APP_GUEST_PASS_KEY}`,
  "Content-Type": "application/json"
};

const updateUser = async user => {
  const newUser = await db.collection("users").findOneAndUpdate(
    { _id: user.sub },
    {
      $set: user
    },
    { returnOriginal: false }
  );
  return newUser.value;
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

module.exports = db => {
  const updateTixCount = async (cart, eventId, charges, guestInfo) => {
    console.log("charges get", charges);
    const obj = {};
    for (var tix in cart) {
      const key = `ticketTypes.${tix}.currentQuantity`;
      obj[key] = -cart[tix];
    }
    console.log("beans", Object.assign({}, charges[0], { guestInfo }));
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
  const router = express.Router();
  // Wrap an async function so we catch any errors that might occur
  const wrapAsync = handler => (req, res) =>
    handler(req)
      .then(result => res.json(result))
      .catch(error => res.status(500).json({ error: error.message }));

  // Get an event
  router.get(
    "/event/:slug",
    wrapAsync(async function(req) {
      const slug = req.params.slug;

      return db
        .collection("tba")
        .find({ $or: [{ _id: ObjectId(slug) }, { slug }] })
        .toArray();
    })
  );

  router.get(
    "/events/:sub",
    wrapAsync(async function(req) {
      const sub = req.params.sub;
      console.log(
        db
          .collection("tba")
          .find({ organizerId: sub })
          .toArray()
      );
      return db
        .collection("tba")
        .find({ organizerId: sub })
        .toArray();
    })
  );
  router.get(
    "/user/:sub",
    wrapAsync(async function(req) {
      const sub = req.params.sub;
      return await db
        .collection("users")
        .find({ _id: sub })
        .toArray();
    })
  );

  router.post(
    "/user",
    wrapAsync(async function(req) {
      const data = await json(req);
      const user = data.data;
      console.log("data", data);
      console.log("user", user);
      return await db.collection("users").updateOne(
        { _id: user.sub },
        {
          $set: user
        },
        {
          upsert: true,
          returnNewDocument: true
        }
      );
    })
  );
  router.post(
    "/connect/create",
    wrapAsync(async function(req) {
      const data = await json(req);
      const user = data.data;
      console.log("user", user);
      const getImage = (url, callback) => {
        https.get(url, res => {
          // Initialise an array
          const bufs = [];

          // Add the data to the buffer collection
          res.on("data", function(chunk) {
            bufs.push(chunk);
          });

          // This signifies the end of a request
          res.on("end", function() {
            // We can join all of the 'chunks' of the image together
            const data = Buffer.concat(bufs);

            // Then we can call our callback.
            callback(null, data);
          });
        });
        // Inform the callback of the error.
      };

      const accountToken = async () => {
        return new Promise(async function(resolve, reject) {
          await stripe.tokens.create(
            {
              account: {
                individual: {
                  first_name: user.accountSettings.firstName,
                  last_name: user.accountSettings.lastName
                },
                tos_shown_and_accepted: true
              }
            },
            function(err, token) {
              // asynchronously called
              resolve(token);
            }
          );
        });
      };
      const companyAccount = async => {
        return new Promise(async function(resolve, reject) {
          await stripe.account.create(
            {
              type: "custom",
              country: "US",
              email: user.email,
              requested_capabilities: ["card_payments", "transfers"],
              tos_acceptance: {
                date: Math.floor(Date.now() / 1000),
                ip: req.ip // Assumes you're not using a proxy
              },
              business_type: "individual",
              business_profile: {
                mcc: 7929,
                url: "http://www.whatstba.com"
              },
              company: {
                address: {
                  state: user.accountSettings.state,
                  city: user.accountSettings.city,
                  postal_code: user.accountSettings.zipCode,
                  line1: user.accountSettings.homeAddress,
                  line2: user.accountSettings.homeAddress2
                },
                name,
                phone: user.accountSettings.phoneNumber.split(" ").join(""),
                tax_id: user.accountSettings.taxId
              },
              individual: {
                first_name: user.accountSettings.firstName,
                last_name: user.accountSettings.lastName,
                ssn_last_4: user.accountSettings.lastFourSSN,
                address: {
                  state: user.accountSettings.state,
                  city: user.accountSettings.city,
                  postal_code: user.accountSettings.zipCode,
                  line1: user.accountSettings.homeAddress,
                  line2: user.accountSettings.homeAddress2
                },
                dob: {
                  day: user.accountSettings.dob.split("/")[1],
                  month: user.accountSettings.dob.split("/")[0],
                  year: user.accountSettings.dob.split("/")[2]
                },
                email: user.email,
                phone: user.accountSettings.phoneNumber.split(" ").join("")
              }
            },
            function(err, acc) {
              // asynchronously called
              if (err) {
                console.log(err);
                reject(err);
              }
              resolve(acc);
            }
          );
        });
      };
      const individualAccount = async => {
        return new Promise(async function(resolve, reject) {
          await stripe.account.create(
            {
              type: "custom",
              country: "US",
              email: user.email,
              requested_capabilities: ["card_payments", "transfers"],
              tos_acceptance: {
                date: Math.floor(Date.now() / 1000),
                ip: req.ip // Assumes you're not using a proxy
              },
              business_type: "individual",
              business_profile: {
                mcc: 7929,
                url: "http://www.whatstba.com"
              },
              individual: {
                first_name: user.accountSettings.firstName,
                last_name: user.accountSettings.lastName,
                id_number: user.accountSettings.lastFourSSN,
                address: {
                  state: user.accountSettings.state,
                  city: user.accountSettings.city,
                  postal_code: user.accountSettings.zipCode,
                  line1: user.accountSettings.homeAddress,
                  line2: user.accountSettings.homeAddress2
                },
                dob: {
                  day: user.accountSettings.dob.split("/")[1],
                  month: user.accountSettings.dob.split("/")[0],
                  year: user.accountSettings.dob.split("/")[2]
                },
                email: user.email,
                phone: user.accountSettings.phoneNumber.split(" ").join("")
              }
            },
            function(err, acc) {
              // asynchronously called
              if (err) {
                console.log(err);
                reject(err);
              }
              resolve(acc);
            }
          );
        });
      };
      const bank = async userAcc => {
        console.log("bank", userAcc);
        return new Promise(async function(resolve, reject) {
          await stripe.accounts.createExternalAccount(
            userAcc.id,
            {
              external_account: {
                object: "bank_account",
                routing_number: user.accountSettings.routingNumber,
                account_number: user.accountSettings.accountNumber,
                currency: "USD",
                country: "US",
                account_holder_name: user.accountSettings.firstName,
                account_holder_type: user.accountSettings.acccountType
              }
            },
            function(err, acc) {
              // asynchronously called
              if (err) {
                console.log(err);
                reject(err);
              }
              resolve(acc);
            }
          );
        });
      };
      const updateAccount = async account => {
        return new Promise(async function(resolve, reject) {
          await stripe.accounts.retrieve(account.id, function(err, acc) {
            // asynchronously called
            if (err) {
              console.log(err);
              reject(err);
            }
            resolve(acc);
          });
        });
      };
      const id = async data => {
        return new Promise(function(resolve, reject) {
          stripe.files.create(
            {
              purpose: "identity_document",
              file: {
                data: data,
                name: "file_name.jpg",
                type: "application/octet-stream"
              }
            },
            { stripe_account: CONNECTED_STRIPE_ACCOUNT_ID }
          );
        });
      };

      // let token = await accountToken();
      let userAcc = await individualAccount();
      await bank(userAcc);
      userAcc = await updateAccount(userAcc);
      user.stripe = userAcc;
      console.log("acc", userAcc);

      const newUser = await db.collection("users").findOneAndUpdate(
        { _id: user.sub },
        {
          $set: user
        },
        { returnOriginal: false }
      );
      return newUser.value;
    })
  );
  router.post(
    "/connect/update",
    wrapAsync(async function(req) {
      const data = await json(req);
      const user = data.data;
      console.log("user", user);
      const getImage = (url, callback) => {
        https.get(url, res => {
          // Initialise an array
          const bufs = [];

          // Add the data to the buffer collection
          res.on("data", function(chunk) {
            bufs.push(chunk);
          });

          // This signifies the end of a request
          res.on("end", function() {
            // We can join all of the 'chunks' of the image together
            const data = Buffer.concat(bufs);

            // Then we can call our callback.
            callback(null, data);
          });
        });
        // Inform the callback of the error.
      };

      const account = async => {
        return new Promise(async function(resolve, reject) {
          await stripe.account.update(
            user.id,
            {
              individual: {
                first_name: user.firstName,
                last_name: user.lastName,
                ssn_last_4: user.lastFourSSN,
                address: user.address,
                dob: user.dob,
                email: user.email,
                phone: user.phone
              },
              business_type: "individual"
            },
            function(err, acc) {
              // asynchronously called
              if (err) {
                console.log(err);
                reject(err);
              }
              resolve(acc);
            }
          );
        });
      };
      const bank = async => {
        return new Promise(async function(resolve, reject) {
          await stripe.accounts.createExternalAccount(
            user.id,
            {
              external_account: {
                object: "bank_account",
                routing_number: user.routingNumber,
                account_number: user.acctNumber,
                currency: user.currency,
                country: user.country,
                account_holder_name: user.firstName,
                account_holder_type: user.businessType
              }
            },
            function(err, acc) {
              // asynchronously called
              if (err) {
                console.log(err);
                reject(err);
              }
              resolve(acc);
            }
          );
        });
      };
      const id = async data => {
        return new Promise(function(resolve, reject) {
          stripe.files.create(
            {
              purpose: "identity_document",
              file: {
                data: data,
                name: "file_name.jpg",
                type: "application/octet-stream"
              }
            },
            { stripe_account: CONNECTED_STRIPE_ACCOUNT_ID }
          );
        });
      };

      let userAcc = await bank();
      console.log("acc", userAcc);

      return userAcc;
    })
  );

  router.post(
    "/user/add/:event",
    wrapAsync(async function(req) {
      const user = await json(req);
      const newUser = await db.collection("users").findOneAndUpdate(
        { _id: user.sub },
        {
          $set: user,
          $push: {
            connectedEvents: {
              $each: [req.params.event],
              $position: 0
            }
          }
        },
        { returnOriginal: false }
      );
      return newUser.value;
    })
  );

  router.post(
    "/event",
    wrapAsync(async function(req) {
      const data = await json(req);
      console.log("update", data);
      const event = data.data;
      if (
        typeof event.endTime === "undefined" &&
        typeof event.startTime === "undefined"
      ) {
        delete event.endTime;
        delete event.startTime;
      }
      if (!event.guestmanager && event.location.name) {
        await axios({
          method: "post",
          url: "http://app.guestmanager.com/api/public/v2/venues/",
          data: {
            venue: {
              name: event.location.name,
              time_zone: "Eastern Time (US & Canada)",
              address: {
                address1: event.location.streetAddress,
                city: event.location.city,
                zipcode: event.location.postalCode,
                state_code: event.location.state,
                country_code: "US"
              }
            }
          },
          headers
        }).then(res => {
          event.guestmanager = res.data;
        });
        await axios({
          method: "post",
          url: "http://app.guestmanager.com/api/public/v2/events/",
          data: {
            event: {
              name: event.title,
              starts_at: event.startDate,
              ends_at: event.endDate,
              venue_id: event.guestmanager.id
            }
          },
          headers
        })
          .then(res => {
            event.guestId = res.data.id;
            console.log(res.data);
          })
          .catch(err => {
            console.log(err);
          });
      }
      const { ticketTypes } = event;
      const tickets = [];
      for (var tix in ticketTypes) {
        if (ticketTypes[tix].id) continue;
        tickets.push(
          await axios({
            method: "post",
            url: "http://app.guestmanager.com/api/public/v2/ticket_types/",
            data: {
              ticket_type: {
                name: tix,
                pdf_template_id: 10164
              }
            },
            headers
          })
            .then(res => {
              event.ticketTypes[tix].id = res.data.id;
              console.log(res.data);
            })
            .catch(err => {
              console.log(err);
            })
        );
      }
      await Promise.all(tickets);

      event._id = ObjectId(event._id);
      let newEvent = await db
        .collection("tba")
        .updateOne(
          { _id: event._id },
          { $set: event },
          { upsert: true },
          (err, event) => {
            if (err) return err;
            return event;
          }
        );
      return newEvent;
    })
  );
  router.delete(
    "/event/:id",
    wrapAsync(async function(req) {
      const event = await db
        .collection("tba")
        .deleteOne({ _id: ObjectId(req.params.id) }, (err, eve) => {
          if (err) {
            console.log(err);
            return err;
          }
          console.log(event);
          return eve;
        });
      return event;
    })
  );
  router.post(
    "/order",
    wrapAsync(async function(req) {
      let customer = await json(req);
      let order = "";
      console.log("customer");
      await axios({
        method: "get",
        headers,
        url: `https://app.guestmanager.com/api/public/v2/tickets/${customer.guestInfo[0].id}`
      }).then(res => {
        order = res.data;
      });

      const update = async () => {
        return new Promise(function(resolve, reject) {
          db.collection("tba").findOneAndUpdate(
            {
              _id: ObjectId(customer.metadata.eventId),
              "tickets.id": customer.id
            },
            { $set: { "tickets.$.guestInfo.0": order } },
            { returnOriginal: false },
            (err, eve) => {
              if (err) {
                console.log("err", err);
                return err;
              }
              resolve(eve);
            }
          );
        });
      };

      let event = await update();
      return event.value;
    })
  );
  router.put(
    "/refund/:charge/:id",
    wrapAsync(async function(req) {
      // const body = await json(req);
      // console.log(body);
      let refund, charge;
      await stripe.refunds.create(
        {
          charge: req.params.charge
        },
        (err, refundObject) => {
          console.log("err", err);
          console.log(refundObject);
          refund = refundObject;
        }
      );
      const update = async () => {
        return new Promise(function(resolve, reject) {
          stripe.charges.update(
            req.params.charge,
            { metadata: { status: "refunded" } },
            (err, chargeObject) => {
              console.log("err", err);
              console.log(chargeObject);
              charge = chargeObject;
              resolve(charge);
            }
          );
        });
      };
      let chargy = await update();
      console.log({ refund, chargy });
      // return { refund, chargy };

      // const event = []
      const event = await db
        .collection("tba")
        .updateOne(
          { _id: ObjectId(req.params.id), "tickets.id": req.params.charge },
          { $set: { "tickets.$": chargy } },
          (err, eve) => {
            if (err) {
              console.log(err);
              return err;
            }
            console.log(eve);
            return eve;
          }
        );
      return event;
    })
  );
  router.post(
    "/accounts",
    wrapAsync(async function(req) {
      // const body = await json(req);
      // console.log(body);
      let event = await json(req);

      let refund, charge;
      const account = await stripe.accounts.create({
        country: "US",
        type: "custom",
        requested_capabilities: ["transfers"]
      });

      console.log({ refund, chargy });

      const update = async () => {
        return new Promise(async (resolve, reject) => {
          await db.collection("tba").findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            {
              $push: {
                payouts: {
                  $each: payout[0],
                  $position: 0
                }
              },
              $set: { updatedAt: parseInt(new Date() / 1000) }
            },
            { returnOriginal: false },
            (err, eve) => {
              if (err) {
                console.log(err);
                return err;
              }
              resolve(eve);
              return eve;
            }
          );
        });
      };
      let newEvent = await update();
      return newEvent.value;
    })
  );
  router.post(
    "/payouts/:id",
    wrapAsync(async function(req) {
      // const body = await json(req);
      // console.log(body);
      let event = await json(req);

      let refund, payout;
      const payoutProcess = async () => {
        return new Promise(async (resolve, reject) => {
          await stripe.payouts.create(
            {
              amount: 425,
              currency: "usd"
            },
            (err, payoutObject) => {
              if (err) {
                console.log(err);
                return err;
              }
              resolve(payoutObject);
            }
          );
        });
      };
      payout = await payoutProcess();

      console.log({ payout });

      const update = async () => {
        return new Promise(async (resolve, reject) => {
          await db.collection("tba").findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            {
              $addToSet: {
                payouts: payout
              },
              $set: { updatedAt: parseInt(new Date() / 1000) }
            },
            { returnOriginal: false },
            (err, eve) => {
              if (err) {
                console.log(err);
                return err;
              }
              resolve(eve);
              return eve;
            }
          );
        });
      };
      let newEvent = await update();
      return newEvent.value;
    })
  );

  router.post(
    "/charge",
    wrapAsync(async req => {
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
        obj.status = "great success";
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
        console.log("guestInfo", guestInfo);
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
    })
  );

  return router;
};
