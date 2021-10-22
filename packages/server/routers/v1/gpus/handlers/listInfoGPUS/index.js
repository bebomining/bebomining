const { ResponseError } = require("@bebomining/server/errors");
const { gpus } = require("@bebomining/server/gpus");

exports.listInfoGPUS = async function listInfoGPUS(req, res, next) {
  try {
    const results = await gpus.info(req.query);

    req.locals = { response: { results, statusCode: 200, status: "success" } };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
