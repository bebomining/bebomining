const { ResponseError } = require("@bebomining/server/errors");
const miners = require("@bebomining/server/miners");

exports.listMiners = async function listMiners(req, res, next) {
  try {
    const results = Object.values(miners).map(val => {
      const { private: omit, ...config } = val.config;
      return { ...config };
    });

    req.locals = { response: { statusCode: 200, results, status: "success" } };

    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
