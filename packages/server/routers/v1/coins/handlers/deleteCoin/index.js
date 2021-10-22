const Joi = require("joi");
const { ResponseError } = require("@bebomining/server/errors");
const { coins } = require("@bebomining/server/coins");
const { workers } = require("@bebomining/server/workers");

const paramsValidator = Joi.object({
  id: Joi.number().required()
});

exports.deleteCoin = async function deleteCoin(req, res, next) {
  try {
    /* Validate body req */
    const { error } = paramsValidator.validate(req.params);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const runningsWorkers = workers.runnings;
    const coinResults = await coins.get({ rowid: req.params.id });

    const coinDetails = coinResults?.[0];

    const cannotDelete =
      typeof coinDetails?.coinName !== "string" ||
      coinDetails?.coinName?.trim?.() === "" ||
      runningsWorkers.some(
        ({ coinName, walletName }) =>
          coinName.toLowerCase() === coinDetails?.coinName?.toLowerCase?.() &&
          walletName.toLowerCase() === coinDetails?.walletName?.toLowerCase?.()
      );

    if (cannotDelete) {
      const err = new Error(
        `There are running workers using the coin: '${coinDetails.coinName}' from the wallet '${coinDetails.walletName}'. Please stop it and try again!`
      );
      err.statusCode = 500;
      throw err;
    }

    const results = await coins.remove(req.params);

    req.locals = {
      response: { results, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
