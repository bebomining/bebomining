const {
  successHandler,
  errorHandler
} = require("@bebomining/server/routes-handler");

const { enableCloud } = require("./handlers/enableCloud");
const { disableCloud } = require("./handlers/disableCloud");
const { getCloudSettings } = require("./handlers/getCloudSettings");
const { refreshRigID } = require("./handlers/refreshRigID");
const { userSettings } = require("./handlers/userSettings");

const handleEnablingCloud = [enableCloud, successHandler, errorHandler];
const handleDisablingCloud = [disableCloud, successHandler, errorHandler];
const handleGettingCloud = [getCloudSettings, successHandler, errorHandler];
const handleGetUserSettings = [userSettings, successHandler, errorHandler];
const handleRefreshRigID = [refreshRigID, successHandler, errorHandler];

module.exports = {
  handleEnablingCloud,
  handleDisablingCloud,
  handleGettingCloud,
  handleRefreshRigID,
  handleGetUserSettings
};
