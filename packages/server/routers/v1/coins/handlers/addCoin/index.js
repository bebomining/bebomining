const Joi = require("joi");
const { ResponseError } = require("@bebomining/server/errors");
const { coins } = require("@bebomining/server/coins");

const bodyValidator = Joi.object({
  walletName: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,14}$/)
    .required(),
  coinName: Joi.string()
    .regex(/^([a-zA-Z0-9]{1,10})(\+([a-zA-Z0-9]{1,10}))*$/)
    .required(),
  address: Joi.string().required()
});

exports.addCoin = async function addCoin(req, res, next) {
  try {
    /* Validate body req */
    const { error } = bodyValidator.validate(req.body);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const result = await coins.add(req.body);

    req.locals = {
      response: { result, statusCode: 201, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
