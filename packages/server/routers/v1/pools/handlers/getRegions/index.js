const { ResponseError } = require("@bebomining/server/errors");
const pools = require("@bebomining/server/pools");
const Joi = require("joi");

exports.getRegions = async function getRegions(req, res, next) {
  try {
    Joi.assert(req.params, argsValidation);
    Joi.assert(req.query, queryValidation);

    const { poolName } = req.params;
    const pool = pools[poolName];

    /* Check if poolName exist */
    if (typeof pool === "undefined") {
      const error = new Error(`Pool: ${poolName} is not supported yet!`);
      error.poolName = poolName;
      error.statusCode = 404;
      throw error;
    }

    const { algo } = req.query;
    const { meta, servers } = await pool.regions(algo);

    let results = servers;
    const { serverName } = req.query;
    if (typeof serverName === "string" && serverName.trim() !== "") {
      const targetServer = serverName.trim().toLowerCase();
      results = servers.filter(
        ({ server }) => server.trim().toLowerCase() === targetServer
      );
    }

    req.locals = {
      response: { meta, results, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};

const argsValidation = Joi.object({
  poolName: Joi.string().required()
});

const queryValidation = Joi.object({
  algo: Joi.string(),
  serverName: Joi.string()
});
