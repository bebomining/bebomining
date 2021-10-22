const fs = require("fs");

const acceptDisclaimer = state => ({
  async acceptDisclaimer() {
    state.userSettings.disclaimerAccepted = true;

    fs.writeFileSync(
      state.userSettingsFilePath,
      JSON.stringify(state.userSettings)
    );

    return this;
  }
});

exports.acceptDisclaimer = acceptDisclaimer;
