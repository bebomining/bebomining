const Joi = require("joi");

const { ResponseError } = require("@bebomining/server/errors");
const miners = require("@bebomining/server/miners");
const { workers } = require("@bebomining/server/workers");

const paramsRequest = Joi.object({ id: Joi.number().required() });

exports.startWorker = async function startWorker(req, res, next) {
  try {
    /* Validate req */
    const { error } = paramsRequest.validate(req.params);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const workerDTO = await workers.get(req.params);

    if (typeof workerDTO === "undefined") {
      const err = new Error(`Worker with id: ${req.params.id} not found!`);
      err.statusCode = 404;
      throw err;
    }

    const isRunning = workers.getRunningById(workerDTO.id);
    if (isRunning) {
      const err = new Error(
        `Worker with id: ${req.params.id} is already running !`
      );
      err.statusCode = 500;
      throw err;
    }

    const { minerName } = workerDTO;
    /* Check if miner is supported */
    const currentMiner = miners[minerName];
    if (typeof currentMiner === "undefined") {
      const error = new Error(`Miner: '${minerName}' - Not Supported Yet!`);
      error.statusCode = 404;
      throw error;
    }

    const pidAndStatsPort = await currentMiner.startFromWorker(workerDTO);
    const result = { ...workerDTO, ...pidAndStatsPort };
    workers.addToRunning(result);

    req.locals = { response: { result, statusCode: 201, status: "success" } };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
