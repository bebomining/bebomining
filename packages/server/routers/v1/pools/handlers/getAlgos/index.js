const { ResponseError } = require("@bebomining/server/errors");
const pools = require("@bebomining/server/pools");
const Joi = require("joi");

exports.getAlgos = async function getAlgos(req, res, next) {
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

    const results = await pool.algos(req.params);

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
  poolName: Joi.string().required(),
  minerMode: Joi.string().required()
});
