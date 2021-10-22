const { ResponseError } = require("@bebomining/server/errors");
const pools = require("@bebomining/server/pools");
const { workers } = require("@bebomining/server/workers");

const Joi = require("joi");

exports.getStats = async function getStats(req, res, next) {
  try {
    Joi.assert(req.params, argsValidation);

    const { poolName, workerId } = req.params;
    const pool = pools[poolName];

    /* Check if poolName exist */
    if (typeof pool === "undefined") {
      const error = new Error(`Pool: ${poolName} is not supported yet!`);
      error.poolName = poolName;
      error.statusCode = 404;
      throw error;
    }

    const worker = await workers.get({ id: workerId });
    const workerWithPid = await workers.getRunningById(worker.id);

    /* Check if poolName exist */
    if (typeof workerWithPid === "undefined") {
      const error = new Error(`Worker with id: ${workerId} is not running!`);
      error.poolName = poolName;
      error.statusCode = 404;
      throw error;
    }

    const results = await pool.stats(workerWithPid);

    req.locals = {
      response: { results, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};

const argsValidation = Joi.object({
  poolName: Joi.string().required(),
  workerId: Joi.number().required()
});
