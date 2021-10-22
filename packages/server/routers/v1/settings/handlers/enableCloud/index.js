const { ResponseError } = require("@bebomining/server/errors");
const { settings } = require("@bebomining/server/settings");

exports.enableCloud = async function enableCloud(req, res, next) {
  try {
    const result = await settings.enableCloud();

    req.locals = {
      response: { result, statusCode: 201, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
