const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require("path");
const csv = require("csvtojson");

const { app } = require("electron");
const userDataPath = app.getPath("userData");

const distFolder = process.env.PORTABLE_EXECUTABLE_DIR
  ? `${userDataPath}/miners`
  : "./miners";

const executableProcesses = () => ({
  async executableProcesses({ minerName, minerNameEXE }) {
    const cmd = `wmic process where "name='${minerNameEXE}'" get ProcessID,ExecutablePath /FORMAT:CSV`;
    const { stdout, stderr } = await exec(cmd);

    if (stderr) {
      throw new Error(stderr);
    }

    const targetPath = path.resolve(`${distFolder}/${minerName}`);

    const list = await csv({ noheader: false }).fromString(stdout.trim());

    const processesList = list
      .filter(({ ExecutablePath }) => ExecutablePath.startsWith(targetPath))
      .map(({ ProcessId: pid }) => ({ pid, minerName }));

    return processesList;
  }
});

exports.executableProcesses = executableProcesses;
