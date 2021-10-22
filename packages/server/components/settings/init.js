const path = require("path");
const fs = require("fs");
const { app } = require("electron");
const userDataPath = app.getPath("userData");

const basePath = process.env.PORTABLE_EXECUTABLE_DIR
  ? `${userDataPath}/data`
  : "./data";

const init = state => ({
  async init() {
    const settingsFolder = path.resolve(basePath);
    if (!fs.existsSync(settingsFolder)) {
      fs.mkdirSync(settingsFolder);
    }

    state.userSettingsFilePath = path.resolve(`${basePath}/settings.json`);

    if (fs.existsSync(state.userSettingsFilePath)) {
      const userSettings = fs.readFileSync(state.userSettingsFilePath, {
        encoding: "utf8"
      });
      const fileUserSettings = JSON.parse(userSettings);

      state.userSettings = {
        ...state.userSettings,
        ...fileUserSettings,
        cloudSettings: {
          enabled:
            fileUserSettings?.cloudSettings?.enabled ||
            state.userSettings.cloudSettings.enabled,
          rigID:
            fileUserSettings?.cloudSettings?.rigID ||
            state.userSettings.cloudSettings.rigID
        }
      };

      fs.writeFileSync(
        state.userSettingsFilePath,
        JSON.stringify(state.userSettings)
      );
    } else {
      fs.writeFileSync(
        state.userSettingsFilePath,
        JSON.stringify(state.userSettings)
      );
    }

    return this;
  }
});

exports.init = init;
