const Joi = require("joi");

const { ResponseError } = require("@bebomining/server/errors");
const miners = require("@bebomining/server/miners");

const bodyRequest = Joi.object({
  pid: Joi.number().required(),
  minerName: Joi.string().required()
});

exports.stopMiner = async function stopMiner(req, res, next) {
  try {
    const { minerName } = req.params;
    const { pid } = req.body;

    /* Validate req */
    const { error } = bodyRequest.validate({ minerName, pid });

    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    /* Check if miner is supported */
    const currentMiner = miners[minerName];
    if (typeof currentMiner === "undefined") {
      const error = new Error(`Miner: '${minerName}' - Not Supported Yet!`);
      error.statusCode = 404;
      throw error;
    }

    await currentMiner.stop({ pid, minerName });

    req.locals = {
      response: { minerName, pid, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
