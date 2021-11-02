const platform = require("os").platform();
const os = require("@bebomining/server/os");

const stop = config => ({
  async stop({ pid }) {
    /* Check if miner is supported by the OS */
    const executableName = config.private.os[platform].exe;
    if (typeof executableName === "undefined") {
      const error = new Error(`OS platform: '${platform}' - Not Found!`);
      error.statusCode = 404;
      throw error;
    }

    /* Check if platform exist */
    const runner = os[platform];
    if (typeof runner === "undefined") {
      const error = new Error(`OS: ${platform} is not supported yet!`);
      error.statusCode = 404;
      throw error;
    }

    await runner.stopProcess({ pid });

    return pid;
  }
});

exports.stop = stop;
