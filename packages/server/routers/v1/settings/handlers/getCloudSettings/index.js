const { ResponseError } = require("@bebomining/server/errors");
const { settings } = require("@bebomining/server/settings");

exports.getCloudSettings = async function getCloudSettings(req, res, next) {
  try {
    const result = await settings.getCloudSettings();

    req.locals = {
      response: { result, statusCode: 200, status: "success" }
    };

    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
