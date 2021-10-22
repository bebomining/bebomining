const Joi = require("joi");
const { ResponseError } = require("@bebomining/server/errors");
const { workers } = require("@bebomining/server/workers");

const bodyValidator = Joi.object({
  id: Joi.string().required(),
  workerName: Joi.string()
    .regex(/^[a-zA-Z][a-zA-Z0-9#-_]{2,50}$/)
    .required(),
  poolName: Joi.string().required(),
  poolRegion: Joi.string().required(),
  poolPort: Joi.number().required(),
  coinName: Joi.string().required(),
  minerName: Joi.string().required(),
  minerAssetId: Joi.number().required(),
  minerTagName: Joi.string().required(),
  gpus: Joi.string().required(),
  minerMode: Joi.string().valid("cpu", "gpu").required(),
  algo: Joi.string().required(),
  walletName: Joi.string().required()
});

exports.editWorker = async function editWorker(req, res, next) {
  try {
    const workerEdited = { ...req.body, ...req.params };
    /* Validate body req */
    const { error } = bodyValidator.validate(workerEdited);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const result = await workers.replace(workerEdited);

    const workerWithPid = workers.getRunningById(result.id);
    if (typeof workerWithPid !== "undefined") {
      const err = new Error(`Worker with id: ${result.id} is running!`);
      err.statusCode = 500;
      throw err;
    }

    req.locals = {
      response: { result, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
