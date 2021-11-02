const platform = require("os").platform();
const os = require("@bebomining/server/os");

const instances = config => ({
  async instances() {
    /* Check if platform exist */
    const runner = os[platform];
    if (typeof runner === "undefined") {
      const error = new Error(`OS: ${platform} is not supported yet!`);
      error.statusCode = 404;
      throw error;
    }

    const { name: minerName } = config;
    const { exe: minerNameEXE } = config.private.os[platform];

    const runningInstances = await runner.executableProcesses({
      minerName,
      minerNameEXE
    });
    return runningInstances;
  }
});

exports.instances = instances;
