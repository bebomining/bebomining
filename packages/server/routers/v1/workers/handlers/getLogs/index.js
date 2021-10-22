const { ResponseError } = require("@bebomining/server/errors");
const { workers } = require("@bebomining/server/workers");
const miners = require("@bebomining/server/miners");

const Joi = require("joi");

exports.getLogs = async function getLogs(req, res, next) {
  try {
    /* Validate params req */
    const { error } = paramsValidator.validate(req.params);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const worker = await workers.get(req.params);
    if (typeof worker === "undefined") {
      const err = new Error(`Worker with id: ${req.params.id} not found!`);
      err.statusCode = 404;
      throw err;
    }

    const wokerMiner = miners[worker.minerName];
    if (typeof wokerMiner === "undefined") {
      const err = new Error(
        `Worker with id: ${req.params.id} has not a valid miner software!`
      );
      err.statusCode = 404;
      throw err;
    }

    const workerWithPid = await workers.getRunningById(worker.id);
    if (typeof workerWithPid === "undefined") {
      const err = new Error(`Worker with id: ${req.params.id} is not running!`);
      err.statusCode = 404;
      throw err;
    }

    const workerWithAllDetails = { ...workerWithPid, ...worker };
    try {
      const results = await fetchLogs(workerWithAllDetails);
      req.locals = {
        response: { results, statusCode: 200, status: "success" }
      };
      next();
    } catch (err) {
      workers.removeFromRunning(worker);
      throw err;
    }
    // add worker miner stat
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};

const paramsValidator = Joi.object({
  id: Joi.number().required()
});

async function fetchLogs(worker) {
  return new Promise(resolve => {
    const reset = setTimeout(() => {
      log("");
    }, 5000);

    function log(logString) {
      clearTimeout(reset);
      _eventEmitter.off(`log_${worker.pid}`, log);
      resolve(logString);
    }
    _eventEmitter.on(`log_${worker.pid}`, log);
  });
}
