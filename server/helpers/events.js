const connect = require("./db");
const { createError, send, json } = require("micro");
const axios = require("axios");
const { parse } = require("url");
const ObjectId = require("mongodb").ObjectId;
const cors = require("micro-cors")();

const headers = {
  Authorization: "Token " + process.env.REACT_APP_GUEST_PASS_KEY,
  "Content-Type": "application/json"
};
const wrapAsync = handler => (req, res) =>
  handler(req)
    .then(result => {
      res.setHeader(
        "cache-control",
        "s-maxage=1 maxage=0, stale-while-revalidate"
      );
      return res.json(result);
    })
    .catch(error => res.status(500).json({ error: error.message }));

const events = async (req, res) => {
  const { query } = parse(req.url, true);
  const slug = query.id;
  console.log("slug", slug);
  // Set caching headers to serve stale content (if over a second old)
  // while revalidating fresh content in the background
  res.setHeader("cache-control", "s-maxage=1 maxage=0, stale-while-revalidate");

  const db = await connect();
  const collection = await db.collection("tba");
  const event = ObjectId.isValid(slug)
    ? await collection.find({ _id: ObjectId(slug) }).toArray()
    : await collection.find({ slug }).toArray();
  send(res, 200, event);
};
const create = async (req, res) => {
  // Set caching headers to serve stale content (if over a second old)
  // while revalidating fresh content in the background
  res.setHeader("cache-control", "s-maxage=1 maxage=0, stale-while-revalidate");

  const { event } = req.body;
  console.log(event);
  delete event.endTime;
  delete event.startTime;

  if (!event.guestmanager) {
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
        return event;
      }
    );
  send(res, 200, newEvent);
};

const eventsByOrganizer = wrapAsync(async function(req) {
  const { query } = parse(req.url, true);
  // Set caching headers to serve stale content (if over a second old)
  // while revalidating fresh content in the background
  res.setHeader("cache-control", "s-maxage=1 maxage=0, stale-while-revalidate");
  // console.log('we got it')
  const database = await connect();
  const collection = await database.collection("tba");

  const events = await collection.find({ organizerId: query.id }).toArray();
  console.log(events);
  //   // Respond with a JSON string of all users in the collection
  return events;
});

module.exports = {
  events: cors(events),
  create,
  eventsByOrganizer: cors(eventsByOrganizer)
};
