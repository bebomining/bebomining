const fs = require("fs");

const disableCloud = state => ({
  async disableCloud() {
    state.userSettings.cloudSettings = {
      ...state.userSettings.cloudSettings,
      enabled: false
    };

    fs.writeFileSync(
      state.userSettingsFilePath,
      JSON.stringify(state.userSettings)
    );

    return state.userSettings.cloudSettings;
  }
});

exports.disableCloud = disableCloud;
