const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const refreshRigID = state => ({
  async refreshRigID() {
    const rigID = uuidv4();
    state.userSettings.cloudSettings = {
      ...state.userSettings.cloudSettings,
      rigID
    };

    fs.writeFileSync(
      state.userSettingsFilePath,
      JSON.stringify(state.userSettings)
    );

    return state.userSettings.cloudSettings;
  }
});

exports.refreshRigID = refreshRigID;
