const Joi = require("joi");

const { ResponseError } = require("@bebomining/server/errors");
const miners = require("@bebomining/server/miners");
const { workers } = require("@bebomining/server/workers");

const paramsRequest = Joi.object({ id: Joi.number().required() });

exports.stopWorker = async function stopWorker(req, res, next) {
  try {
    /* Validate req */
    const { error } = paramsRequest.validate(req.params);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const workerDTO = workers.getRunningById(req.params.id);

    console.log("workerDTO => ", workerDTO);

    if (
      typeof workerDTO === "undefined" ||
      typeof workerDTO?.pid === "undefined"
    ) {
      const err = new Error(`Worker with id: ${req.params.id} is not running!`);
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

    await currentMiner.stop({ pid: workerDTO.pid });

    const result = workers.removeFromRunning(workerDTO);

    req.locals = { response: { result, statusCode: 200, status: "success" } };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
