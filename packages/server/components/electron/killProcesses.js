const killProcesses = () => ({
  async killProcesses() {
    const platform = require("os").platform();
    const os = require("@bebomining/server/os");

    /* Check if platform exist */
    const runner = os[platform];
    if (typeof runner === "undefined") {
      const error = new Error(`OS: ${platform} is not supported yet!`);
      error.statusCode = 404;
      throw error;
    }

    const { workers } = require("@bebomining/server/workers");
    const runningMiners = workers.runnings;
    const promises = runningMiners.map(({ pid }) =>
      runner.stopProcess({ pid })
    );
    await Promise.all(promises);
  }
});

exports.killProcesses = killProcesses;
