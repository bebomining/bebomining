const {
  successHandler,
  errorHandler
} = require("@bebomining/server/routes-handler");
const { getCoins } = require("./handlers/getCoins");
const { getAllPools } = require("./handlers/getAllPools");
const { getRegions } = require("./handlers/getRegions");
const { getAlgos } = require("./handlers/getAlgos");
const { getAllAlgos } = require("./handlers/getAllAlgos");
const { getStats } = require("./handlers/getStats");

const handleFetchCoins = [getCoins, successHandler, errorHandler];
const handleFetchAllPools = [getAllPools, successHandler, errorHandler];
const handleFetchRegions = [getRegions, successHandler, errorHandler];
const handleFetchAlgos = [getAlgos, successHandler, errorHandler];
const handleFetchAllAlgos = [getAllAlgos, successHandler, errorHandler];
const handlePoolStats = [getStats, successHandler, errorHandler];

module.exports = {
  handleFetchAllAlgos,
  handleFetchAlgos,
  handleFetchRegions,
  handleFetchCoins,
  handleFetchAllPools,
  handlePoolStats
};
