const Joi = require("joi");
const { ResponseError } = require("@bebomining/server/errors");
const { workers } = require("@bebomining/server/workers");

const bodyValidator = Joi.object({
  workerName: Joi.string()
    .regex(/^[a-zA-Z][a-zA-Z0-9#\-_]{2,50}$/)
    .required(),
  poolName: Joi.string().required(),
  poolRegion: Joi.string().required(),
  poolPort: Joi.number().required(),
  coinName: Joi.string().required(),
  minerName: Joi.string().required(),
  minerAssetId: Joi.number().required(),
  minerTagName: Joi.string().required(),
  gpus: Joi.string()
    .regex(/^(-1)$|^\d+(,\d+)*$/)
    .required(),
  minerMode: Joi.string().valid("cpu", "gpu").required(),
  algo: Joi.string().required(),
  walletName: Joi.string().required()
});

exports.createWorker = async function createWorker(req, res, next) {
  try {
    /* Validate body req */
    const { error } = bodyValidator.validate(req.body);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const result = await workers.add(req.body);

    req.locals = {
      response: { result, statusCode: 201, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
