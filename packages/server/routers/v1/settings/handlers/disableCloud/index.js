const { ResponseError } = require("@bebomining/server/errors");
const { settings } = require("@bebomining/server/settings");

exports.disableCloud = async function disableCloud(req, res, next) {
  try {
    const result = await settings.disableCloud();

    req.locals = {
      response: { result, statusCode: 201, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
