const Joi = require("joi");

const { ResponseError } = require("@bebomining/server/errors");
const miners = require("@bebomining/server/miners");

const paramsRequest = Joi.object({ minerName: Joi.string().required() });

exports.getRunningMiners = async function getRunningMiners(req, res, next) {
  try {
    /* Validate params req */
    const { error } = paramsRequest.validate(req.params);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const { minerName } = req.params;

    /* Check if miner is supported */
    const currentMiner = miners[minerName];
    if (typeof currentMiner === "undefined") {
      const error = new Error(`Miner: '${minerName}' - Not Supported Yet!`);
      error.statusCode = 404;
      throw error;
    }

    try {
      const results = await currentMiner.instances();
      req.locals = {
        response: { results, statusCode: 200, status: "success" }
      };
      next();
    } catch (err) {
      err.statusCode = 404;
      throw err;
    }
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
