const {
  successHandler,
  errorHandler
} = require("@bebomining/server/routes-handler");
const { createWorker } = require("./handlers/createWorker");
const { getAllWorkers } = require("./handlers/getAllWorkers");
const { getWorkerById } = require("./handlers/getWorkerById");
const { deleteWorker } = require("./handlers/deleteWorker");
const { startWorker } = require("./handlers/startWorker");
const { editWorker } = require("./handlers/editWorker");
const { stopWorker } = require("./handlers/stopWorker");
const { getStats } = require("./handlers/getStats");
const { getLogs } = require("./handlers/getLogs");

const handleWorkerCreation = [createWorker, successHandler, errorHandler];
const handleWorkerList = [getAllWorkers, successHandler, errorHandler];
const handleWorkerDeletion = [deleteWorker, successHandler, errorHandler];
const handleWorkerById = [getWorkerById, successHandler, errorHandler];
const handleWorkerStart = [startWorker, successHandler, errorHandler];
const handleWorkerStop = [stopWorker, successHandler, errorHandler];
const handleWorkerEditing = [editWorker, successHandler, errorHandler];
const handleWorkerStats = [getStats, successHandler, errorHandler];
const handleWorkerLogs = [getLogs, successHandler, errorHandler];

module.exports = {
  handleWorkerCreation,
  handleWorkerEditing,
  handleWorkerList,
  handleWorkerDeletion,
  handleWorkerById,
  handleWorkerStart,
  handleWorkerStop,
  handleWorkerStats,
  handleWorkerLogs
};
