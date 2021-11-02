const Joi = require("joi");

const { ResponseError } = require("@bebomining/server/errors");
const miners = require("@bebomining/server/miners");

const bodyRequest = Joi.object({
  assetId: Joi.number().required(),
  minerName: Joi.string().required(),
  args: Joi.array()
});

exports.startMiner = async function startMiner(req, res, next) {
  try {
    const { minerName } = req.params;
    const { assetId, args } = req.body;

    /* Validate req */
    const { error } = bodyRequest.validate({ minerName, assetId, args });

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

    const pid = await currentMiner.start({ assetId, args });

    req.locals = { response: { pid, statusCode: 201, status: "success" } };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
