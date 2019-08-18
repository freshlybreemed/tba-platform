// Local dependencies
const { handleErrors } = require('../helpers/error')
const { postS3 } = require('../helpers/upload')
const { userApi } = require('../helpers/user')
const { create } = require('../helpers/create')
const { createAccount, ticketApi, balanceApi } = require('../helpers/payments')
const { send } = require('micro')

const postApi = fn => async (req, res) => {
    try {
      const parse = req.url.split('/')
      switch(`/${parse[1]}`){
        case "/upload":
          return await fn(postS3(req,res))
        case "/event":
          return await fn(create(req,res))
        case "/account":
          return await fn(createAccount(req,res))
        case "/payments":
          return await fn(ticketApi(req,res))  
        case "/balance":
          return await fn(balanceApi(req,res))
        case "/user":
          return await fn(userApi(req,res))
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
  
module.exports = postApi(handleErrors)


