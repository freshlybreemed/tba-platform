const connect = require("./db");
const cors = require('micro-cors')()
const {createError, send, json} = require('micro')
const ObjectId = require('mongodb').ObjectId
const axios = require('axios')

const create = async (req, res) => {
  // Set caching headers to serve stale content (if over a second old)
  // while revalidating fresh content in the background
  res.setHeader('cache-control', 's-maxage=1 maxage=0, stale-while-revalidate')
  
  const {event} = req.body
  const headers = {
  Authorization: "Token " + process.env.REACT_APP_GUEST_PASS_KEY,
  "Content-Type": "application/json"
  };
  await axios({
  method: "post",
  url: "http://app.guestmanager.com/api/public/v2/venues/",
  data: {
    venue: {
      name: event.location.name.split(',')[0],
      time_zone: "Eastern Time (US & Canada)",
      address: {
        "address1": event.location.address.streetAddress,
        "city": event.location.address.city,
        "zipcode": event.location.address.postalCode,
        "state_code": event.location.address.state,
        "country_code": "US"
        }
      }
    },
  headers
  }).then(res=>{
    event.guestmanager = res.data
  })

  await axios({
  method: "post",
  url: "http://app.guestmanager.com/api/public/v2/events/",
  data: {
    event: {
      "name": event.title,
      "starts_at": event.startDate,
      "ends_at": event.endDate,
      "venue_id": event.guestmanager.id
      }
    },
    headers
  }).then(res=>{
    console.log(res.data)
  }).catch(err=>{
    console.log(err)
  })
  event._id = ObjectId(event._id)
  const collection = await(await connect()).collection('tba')
  const newEvent = await collection.update(
    { _id: event._id },
    event,
    {
        upsert: true,
        returnNewDocument: true
    }
)
  send(res, 200, newEvent)
}
module.exports = { create }