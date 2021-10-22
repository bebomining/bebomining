const { ResponseError } = require("@bebomining/server/errors");
const { coins } = require("@bebomining/server/coins");

exports.getCoins = async function getCoins(req, res, next) {
  try {
    const results = await coins.get(req.query);
    results.sort((a, b) => a.coinName.localeCompare(b.coinName));

    req.locals = {
      response: { results, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
