const util = require("util");
const exec = util.promisify(require("child_process").exec);

const checkPortStatus = () => ({
  async checkPortStatus(portTarget) {
    const cmd = `netstat -aon | findstr /i ":${portTarget}"  | more`;

    const { stdout, stderr } = await exec(cmd);

    if (stderr) {
      throw new Error(stderr);
    }

    const alreadyUse = stdout.trim().length !== 0;

    return alreadyUse;
  }
});

exports.checkPortStatus = checkPortStatus;
