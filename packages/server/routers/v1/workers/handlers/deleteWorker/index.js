const Joi = require("joi");
const { ResponseError } = require("@bebomining/server/errors");
const { workers } = require("@bebomining/server/workers");

const paramsValidator = Joi.object({
  id: Joi.number().required()
});

exports.deleteWorker = async function deleteWorker(req, res, next) {
  try {
    /* Validate body req */
    const { error } = paramsValidator.validate(req.params);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const results = await workers.remove(req.params);

    req.locals = {
      response: { results, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
