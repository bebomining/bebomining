const fs = require("fs");

const enableCloud = state => ({
  async enableCloud() {
    state.userSettings.cloudSettings = {
      ...state.userSettings.cloudSettings,
      enabled: true
    };

    fs.writeFileSync(
      state.userSettingsFilePath,
      JSON.stringify(state.userSettings)
    );

    return state.userSettings.cloudSettings;
  }
});

exports.enableCloud = enableCloud;
