const { json, send } = require("micro");
const connect = require("./db");
const { parse } = require("url");
const ObjectId = require("mongodb").ObjectId;
const cors = require("micro-cors")();

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

const userApi = async (req, res) => {
  const data = await json(req);
  console.log(data);
  // Set caching headers to serve stale content (if over a second old)
  // while revalidating fresh content in the background
  res.setHeader("cache-control", "s-maxage=1 maxage=0, stale-while-revalidate");

  const database = await connect();
  const collection = await database.collection("users");

  const user = await collection.findOneAndUpdate(
    { _id: data.sub },
    {
      $setOnInsert: data,
      $set: { updatedAt: Math.floor(new Date() / 1000) }
    },
    {
      upsert: true,
      returnNewDocument: true
    }
  );
  send(res, 200, user);

  // Respond with a JSON string
};
const userQueryApi = wrapAsync(async function(req) {
  const { query } = parse(req.url, true);
  const sub = query.id;
  console.log("sub", sub);
  const database = await connect();
  const collection = await database.collection("users");
  console.log(collection.find({ _id: sub }).toArray());
  return await collection.find({ _id: sub }).toArray();
});
module.exports = {
  userApi: cors(userApi),
  userQueryApi: cors(userQueryApi)
};
