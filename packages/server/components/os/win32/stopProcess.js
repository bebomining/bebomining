const util = require("util");
const exec = util.promisify(require("child_process").exec);

const stopProcess = () => ({
  async stopProcess({ pid }) {
    const cmd = `Taskkill /PID ${pid} /F`;
    const { stdout, stderr } = await exec(cmd);

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout;
  }
});

exports.stopProcess = stopProcess;
