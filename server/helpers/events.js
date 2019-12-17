const connect = require("./db");
const { createError, send, json } = require("micro");
const axios = require("axios");
const { parse } = require("url");
const ObjectId = require("mongodb").ObjectId;
const cors = require("micro-cors")();
const { wrapAsync } = require("../handlers/lib");
const headers = {
  Authorization: "Token " + process.env.REACT_APP_GUEST_PASS_KEY,
  "Content-Type": "application/json"
};

const events = wrapAsync(async function(req, db) {
  const { query } = parse(req.url, true);
  const slug = query.slug;
  console.log("slug", slug);
  return db
    .collection("tba")
    .find({ $or: [{ _id: ObjectId(slug) }, { slug }] })
    .toArray();
});
const create = wrapAsync(async function(req, db) {
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
  return newEvent;
});

const eventsByOrganizer = wrapAsync(async function(req, db) {
  const { query } = parse(req.url, true);
  const sub = query.sub;
  return db
    .collection("tba")
    .find({ organizerId: sub })
    .toArray();
});

module.exports = {
  events: cors(events),
  create,
  eventsByOrganizer: cors(eventsByOrganizer)
};
