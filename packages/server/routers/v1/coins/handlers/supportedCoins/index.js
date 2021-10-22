const { ResponseError } = require("@bebomining/server/errors");
const { coins } = require("@bebomining/server/coins");

exports.supportedCoins = async function supportedCoins(req, res, next) {
  try {
    const results = await coins.supported();
    results.sort((a, b) => a.symbol.localeCompare(b.symbol));

    req.locals = {
      response: { results, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
