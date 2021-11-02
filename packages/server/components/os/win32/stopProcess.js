const util = require("util");
const exec = util.promisify(require("child_process").exec);
const csv = require("csvtojson");

const stopProcess = () => ({
  async stopProcess({ pid }) {
    const getProcessesChildren = `wmic process where "ParentProcessId=${pid}" get Caption,ProcessId /FORMAT:CSV`;
    const { stdout, stderr } = await exec(getProcessesChildren);
    if (stderr) {
      throw new Error(stderr);
    }

    const csvProcesses = await csv({ noheader: false }).fromString(
      stdout.trim()
    );

    csvProcesses.push({ ProcessId: pid });

    const promisesProcesses = csvProcesses.map(async ({ ProcessId }) => {
      const cmd = `Taskkill /PID ${ProcessId} /F`;
      const { stdout, stderr } = await exec(cmd);
      if (stderr) {
        throw new Error(stderr);
      }
      return stdout;
    });

    const results = await Promise.all(promisesProcesses);

    return results;
  }
});

exports.stopProcess = stopProcess;
