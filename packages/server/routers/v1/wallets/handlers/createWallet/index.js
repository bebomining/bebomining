const Joi = require("joi");
const { ResponseError } = require("@bebomining/server/errors");
const { wallets } = require("@bebomining/server/wallets");

const bodyValidator = Joi.object({
  walletName: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,14}$/)
    .required()
});

exports.createWallet = async function createWallet(req, res, next) {
  try {
    /* Validate body req */
    const { error } = bodyValidator.validate(req.body);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const result = await wallets.add(req.body);

    req.locals = {
      response: { result, statusCode: 201, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
