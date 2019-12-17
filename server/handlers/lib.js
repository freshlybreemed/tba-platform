const connect = require("../helpers/db");

export const wrapAsync = handler => async (req, res) => {
  res.setHeader("cache-control", "s-maxage=1 maxage=0, stale-while-revalidate");
  const db = await connect();

  return handler(req, db)
    .then(result => {
      res.setHeader(
        "cache-control",
        "s-maxage=1 maxage=0, stale-while-revalidate"
      );
      return res.json(result);
    })
    .catch(error => res.status(500).json({ error: error.message }));
};
