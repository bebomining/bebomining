const { ResponseError } = require("@bebomining/server/errors");
const { workers } = require("@bebomining/server/workers");
const pools = require("@bebomining/server/pools");
const miners = require("@bebomining/server/miners");

const Joi = require("joi");

exports.getWorkerById = async function getWorkerById(req, res, next) {
  try {
    /* Validate params req */
    const { error } = paramsValidator.validate(req.params);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const worker = await workers.get(req.params);
    const { minerName } = worker;
    const currentMiner = miners[minerName];

    if (typeof currentMiner === "undefined") {
      const error = new Error(`Miner: '${minerName}' - Not Supported Yet!`);
      error.statusCode = 404;
      throw error;
    }

    const { supportGPUsRegex } = currentMiner.config;
    const workerWithPid = await workers.getRunningById(worker.id);

    const results = { ...workerWithPid, ...worker, supportGPUsRegex };

    if (typeof results === "undefined") {
      const err = new Error(`Worker with id: ${req.params.id} not found!`);
      err.statusCode = 404;
      throw err;
    }

    const { poolName, coinName, address, workerName, algo } = worker;
    const { stats } = pools[poolName].config.private;
    const wokerStatsUrl = stats[algo] || stats;
    const meta = {
      statsUrl: wokerStatsUrl
        .replace("${coinName}", coinName.toLowerCase())
        .replace("${address}", address)
        .replace("${workerName}", workerName)
    };

    req.locals = {
      response: { meta, results, statusCode: 200, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};

const paramsValidator = Joi.object({
  id: Joi.number().required()
});
