const Joi = require("joi");
const { ResponseError } = require("@bebomining/server/errors");
const { wallets } = require("@bebomining/server/wallets");
const { workers } = require("@bebomining/server/workers");

const paramsValidator = Joi.object({
  id: Joi.number().required()
});

exports.deleteWallet = async function deleteWallet(req, res, next) {
  try {
    /* Validate body req */
    const { error } = paramsValidator.validate(req.params);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const runningsWorkers = workers.runnings;
    const walletResults = await wallets.getWallet({ id: req.params.id });

    const walletDetails = walletResults?.[0];

    const cannotDelete =
      typeof walletDetails?.walletName !== "string" ||
      walletDetails?.walletName?.trim?.() === "" ||
      runningsWorkers.some(
        ({ walletName }) =>
          walletName.toLowerCase() ===
          walletDetails?.walletName?.toLowerCase?.()
      );

    if (cannotDelete) {
      const err = new Error(
        `There are running workers using the wallet: '${walletDetails.walletName}'. Please stop it and try again!`
      );
      err.statusCode = 500;
      throw err;
    }

    const results = await wallets.remove(req.params);

    req.locals = {
      response: { results, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
