const { ResponseError } = require("@bebomining/server/errors");
const { cache } = require("@bebomining/server/cache");
const fetch = require("@bebomining/server/fetch");

const duration = 4.68e8;

const isDev = process.env.NODE_ENV === "development";
const apiBaseURL = isDev
  ? "http://localhost:8084"
  : "https://bebomining.github.io/bebomining";

exports.getCoins = async function getCoins(req, res, next) {
  try {
    const donationsURL = `${apiBaseURL}/api/v1/donations/coins.json`;

    let results = cache.get(donationsURL);

    if (results === null) {
      const resAPI = await fetch(donationsURL);
      results = await resAPI.json();
      cache.put(donationsURL, results, duration);
    }

    req.locals = {
      response: { results, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    const responseError = ResponseError(error);
    next(responseError);
  }
};
