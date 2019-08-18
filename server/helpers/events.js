const connect = require("./db");
const { parse } = require("url");
const ObjectId = require('mongodb').ObjectId
const cors = require('micro-cors')()

const events = async (req, res) => {
  const { query } = parse(req.url, true);
  console.log(query.id)
  // Set caching headers to serve stale content (if over a second old)
  // while revalidating fresh content in the background
  res.setHeader('cache-control', 's-maxage=1 maxage=0, stale-while-revalidate')

  const database = await connect()
  const collection = await database.collection('tba')

  const event = await collection.find({_id: ObjectId(query.id)}).toArray()

  // Respond with a JSON string of all users in the collection
  res.status(200).json(event)
}

const eventsByOrganizer = async (req, res) => {
  const { query } = parse(req.url, true);
  console.log(query)
  // Set caching headers to serve stale content (if over a second old)
  // while revalidating fresh content in the background
  res.setHeader('cache-control', 's-maxage=1 maxage=0, stale-while-revalidate')

  const database = await connect()
  const collection = await database.collection('tba')

  const event = await collection.find({organizerId: query.id}).toArray()

  // Respond with a JSON string of all users in the collection
  res.status(200).json(event)
}


module.exports = { events: cors(events), eventsByOrganizer:cors(eventsByOrganizer) }