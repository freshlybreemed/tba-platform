require("dotenv").config();
const express = require("express");
const next = require("next");
const api = require("./lib/api");

const co = require("co");
const url = require("url");
const { MongoClient, ObjectId } = require("mongodb");
const PORT = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const { MONGO_URL } = process.env;
const app = next({ dev });
const handle = app.getRequestHandler();

co(function*() {
  // Initialize the Next.js app
  yield app.prepare();

  console.log(`Connecting to ${MONGO_URL}`);
  const db = yield MongoClient.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  // Configure express to expose a REST API
  const server = express();
  server.use((req, res, next) => {
    // Also expose the MongoDB database handle so Next.js can access it.
    req.db = db.db("tba");
    next();
  });
  server.use("/api", api(db.db("tba")));

  // Everything that isn't '/api' gets passed along to Next.js
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT);
  console.log(`Listening on ${PORT}`);
}).catch(error => console.error(error.stack));
