const { ResponseError } = require("@bebomining/server/errors");
const miners = require("@bebomining/server/miners");

exports.listReleases = async function listReleases(req, res, next) {
  try {
    const { minerName = "" } = req.params;
    const currentMiner = miners[minerName];

    if (typeof currentMiner === "undefined") {
      const error = new Error(`Miner: '${minerName}' Not Found!`);
      error.statusCode = 404;
      throw error;
    }

    const results = await currentMiner.releases();

    req.locals = { response: { statusCode: 200, results, status: "success" } };

    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
