const { ResponseError } = require("@bebomining/server/errors");
const { settings } = require("@bebomining/server/settings");

exports.refreshRigID = async function refreshRigID(req, res, next) {
  try {
    const result = await settings.refreshRigID();

    req.locals = {
      response: { result, statusCode: 201, status: "success" }
    };

    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
