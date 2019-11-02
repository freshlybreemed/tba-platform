// Local dependencies
const { handleErrors } = require('../helpers/error')
const { deleteEvent, eventsByOrganizer } = require('../helpers/events')
const { send } = require('micro')
const url = require('url')
const { balanceApi } = require('../helpers/payments')

const getApi = fn => async (req, res) => {
  console.log("got it")
  console.log('req.url',req.url)
    try {
      const parse = req.url.split('/')
      const path = `/${parse[1]}/${parse[2]}`
      switch(path){
        case "/api/event":
          return await fn(deleteEvent(req,res))
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