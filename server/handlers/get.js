// Local dependencies
const { handleErrors } = require('../helpers/error')
const { events, eventsByOrganizer } = require('../helpers/events')
const { send } = require('micro')
const url = require('url')
const { balanceApi } = require('../helpers/payments')

const getApi = fn => async (req, res) => {
    try {
      const parse = req.url.split('/')
      switch("/"+parse[1]+"/"+parse[2]){
        case "/api/event":
          return await fn(events(req,res))
        case "/api/eventsByOrganizer":
          return await fn(eventsByOrganizer(req,res))
        case "/api/balance":
          return await fn(balanceApi(req,res))
        default:
          return send(res, 200, {"err":"invalid route"})
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      const message = err.message || 'Internal Server Error'
      console.error(err)
      return send(res, statusCode, message)
    }
  }

module.exports = getApi(handleErrors)