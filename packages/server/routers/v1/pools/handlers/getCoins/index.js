const { ResponseError } = require("@bebomining/server/errors");
const pools = require("@bebomining/server/pools");
const Joi = require("joi");

exports.getCoins = async function getCoins(req, res, next) {
  try {
    Joi.assert(req.params, argsValidation);

    const { poolName } = req.params;
    const pool = pools[poolName];

    /* Check if poolName exist */
    if (typeof pool === "undefined") {
      const error = new Error(`Pool: ${poolName} is not supported yet!`);
      error.poolName = poolName;
      error.statusCode = 404;
      throw error;
    }

    let results = await pool.coins();
    results.sort((a, b) => a.symbol.localeCompare(b.symbol));

    const { algo } = req.query || {};

    if (algo) {
      results = results.filter(
        ({ algos }) =>
          typeof algo === "string" &&
          algo.trim() !== "" &&
          algos.includes(algo.toLowerCase())
      );
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

const argsValidation = Joi.object({
  poolName: Joi.string().required()
});
