const { ResponseError } = require("@bebomining/server/errors");
const { workers } = require("@bebomining/server/workers");
const miners = require("@bebomining/server/miners");

exports.getAllWorkers = async function getAllWorkers(req, res, next) {
  try {
    const { onlyRunning, ...restFilter } = req.query;

    const resultsDTO = await workers.getAll(restFilter);
    let results = resultsDTO.map(workerDTO => {
      const { minerName } = workerDTO;
      const currentMiner = miners[minerName];

      if (typeof currentMiner === "undefined") {
        const error = new Error(`Miner: '${minerName}' - Not Supported Yet!`);
        error.statusCode = 404;
        throw error;
      }

      const { supportGPUsRegex } = currentMiner.config;

      const runningWorker = workers.getRunningById(workerDTO.id);
      if (typeof runningWorker !== "undefined") {
        return { ...runningWorker, ...workerDTO, supportGPUsRegex };
      } else {
        return { ...workerDTO, supportGPUsRegex };
      }
    });

    if (onlyRunning === "true") {
      results = results.filter(({ pid }) => typeof pid === "number");
    }

    req.locals = {
      response: { results, statusCode: 200, status: "success" }
    };

    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
