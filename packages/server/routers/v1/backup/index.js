const {
  successHandler,
  errorHandler
} = require("@bebomining/server/routes-handler");

const { createBackup } = require("./handlers/createBackup");
const { restoreBackup } = require("./handlers/restoreBackup");

const handleCreateBackup = [createBackup, successHandler, errorHandler];
const handleRestoreBackup = [restoreBackup, successHandler, errorHandler];

module.exports = {
  handleCreateBackup,
  handleRestoreBackup
};
