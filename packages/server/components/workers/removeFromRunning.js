const platform = require("os").platform();
const os = require("@bebomining/server/os");

const removeFromRunning = state => ({
  async removeFromRunning(workerWithPid) {
    try {
      const runner = os[platform];
      const pid = workerWithPid.pid;
      await runner?.stopProcess?.({ pid });
    } finally {
      const index = state.runnings.findIndex(
        ({ id }) => Number(id) === Number(workerWithPid.id)
      );

      if (index > -1) {
        return state.runnings.splice(index, 1);
      }

      return [];
    }
  }
});

exports.removeFromRunning = removeFromRunning;
