const { ResponseError } = require("@bebomining/server/errors");
const { settings } = require("@bebomining/server/settings");

exports.userSettings = function userSettings(req, res, next) {
  try {
    const result = settings.userSettings;

    req.locals = {
      response: { result, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
