const {
  successHandler,
  errorHandler
} = require("@bebomining/server/routes-handler");
const { listInfoGPUS } = require("./handlers/listInfoGPUS");

const handleInfoGPU = [listInfoGPUS, successHandler, errorHandler];

module.exports = { handleInfoGPU };
