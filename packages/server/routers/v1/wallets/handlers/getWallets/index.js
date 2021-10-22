const { ResponseError } = require("@bebomining/server/errors");
const { wallets } = require("@bebomining/server/wallets");

exports.getWallets = async function getWallets(req, res, next) {
  try {
    const results = await wallets.getWallet(req.query);

    if (results.length <= 0) {
      const error = new Error(`No Wallets!`);
      error.statusCode = 404;
      throw error;
    }

    req.locals = {
      response: { results, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
