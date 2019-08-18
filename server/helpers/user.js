const { json, send } = require("micro");
const connect = require("./db");
const { parse } = require("url");
const ObjectId = require('mongodb').ObjectId
const cors = require('micro-cors')()


const userApi = async (req, res) => {
    const data = await json(req);
    console.log(data)
    // Set caching headers to serve stale content (if over a second old)
    // while revalidating fresh content in the background
    res.setHeader('cache-control', 's-maxage=1 maxage=0, stale-while-revalidate')
  
    const database = await connect()
    const collection = await database.collection('users')
  
    const user = await collection.findOneAndUpdate(
        { _id: data.sub },
        {$setOnInsert: data},
        {
            upsert: true,
            returnNewDocument: true
        }
    )
    send(res, 200, user)
  
    // Respond with a JSON string 
}
module.exports = {
    userApi: cors(userApi)
  }
