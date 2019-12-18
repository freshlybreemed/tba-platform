// Local dependencies
const { handleErrors } = require("../helpers/error");
const { events, eventsByOrganizer } = require("../helpers/events");
const { send } = require("micro");
const url = require("url");
const { balanceApi } = require("../helpers/payments");
const { userQueryApi } = require("../helpers/user");

const getApi = fn => async (req, res) => {
  console.log("req.url", req.url);
  try {
    const parse = req.url.split("/");
    const path = `/${parse[2]}`;
    console.log("path", path);
    switch (path) {
      case "/event":
        return await fn(events(req, res));
      case "/events":
        return await fn(eventsByOrganizer(req, res));
      case "/balance":
        return await fn(balanceApi(req, res));
      case "/user":
        return await fn(userQueryApi(req, res));
      default:
        return send(res, 200, { err: "invalid route" });
    }
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(err);
    return send(res, statusCode, message);
  }
};

module.exports = getApi(handleErrors);
