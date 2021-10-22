const { init } = require("./init");
const { acceptDisclaimer } = require("./acceptDisclaimer");
const { enableCloud } = require("./enableCloud");
const { disableCloud } = require("./disableCloud");
const { getCloudSettings } = require("./getCloudSettings");
const { refreshRigID } = require("./refreshRigID");

const pjson = require("./../../package.json");
const appServerVersion = pjson.version;
const { v4: uuidv4 } = require("uuid");

function settings() {
  const state = {
    userSettings: {
      disclaimerAccepted: false,
      cloudSettings: {
        enabled: false,
        rigID: uuidv4()
      }
    },
    userSettingsFilePath: "",
    appServerVersion
  };
  return {
    ...init(state),
    ...acceptDisclaimer(state),
    ...enableCloud(state),
    ...disableCloud(state),
    ...getCloudSettings(state),
    ...refreshRigID(state),
    get userSettings() {
      return { ...state.userSettings, appServerVersion };
    }
  };
}

exports.settings = settings();
