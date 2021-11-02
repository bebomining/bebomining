const { ResponseError } = require("@bebomining/server/errors");
const miners = require("@bebomining/server/miners");

exports.getInstalledMiners = async function getInstalledMiners(req, res, next) {
  try {
    const { minerName } = req.params;

    /* Check if miner is supported */
    const currentMiner = miners[minerName];
    if (typeof currentMiner === "undefined") {
      const error = new Error(`Miner: '${minerName}' - Not Supported Yet!`);
      error.statusCode = 404;
      throw error;
    }

    const results = await currentMiner.installed();

    if (results === null) {
      const error = new Error(`Miner: '${minerName}' - Not Installed Yet!`);
      error.statusCode = 404;
      throw error;
    }

    req.locals = {
      response: { results, minerName, statusCode: 200, status: "success" }
    };

    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
