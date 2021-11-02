const {
  successHandler,
  errorHandler
} = require("@bebomining/server/routes-handler");
const { createMiner } = require("./handlers/createMiner");
const { listReleases } = require("./handlers/listReleases");
const { listMiners } = require("./handlers/listMiners");
const { startMiner } = require("./handlers/startMiner");
const { stopMiner } = require("./handlers/stopMiner");
const { getRunningMiners } = require("./handlers/getRunningMiners");
const { getInstalledMiners } = require("./handlers/getInstalledMiners");
const { getAllInstalledMiners } = require("./handlers/getAllInstalledMiners");

const handleMinerCreation = [createMiner, successHandler, errorHandler];
const handleReleasesList = [listReleases, successHandler, errorHandler];
const handleMinersList = [listMiners, successHandler, errorHandler];
const handleMinersStart = [startMiner, successHandler, errorHandler];
const handleRunningMiners = [getRunningMiners, successHandler, errorHandler];
const handleInstalledMiner = [getInstalledMiners, successHandler, errorHandler];
const handleAllInstalledMiner = [
  getAllInstalledMiners,
  successHandler,
  errorHandler
];

const handleMinersStop = [stopMiner, successHandler, errorHandler];

module.exports = {
  handleMinerCreation,
  handleReleasesList,
  handleMinersList,
  handleMinersStart,
  handleRunningMiners,
  handleInstalledMiner,
  handleAllInstalledMiner,
  handleMinersStop
};
