const getCloudSettings = state => ({
  async getCloudSettings() {
    return state.userSettings.cloudSettings;
  }
});

exports.getCloudSettings = getCloudSettings;
