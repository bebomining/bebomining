const { executableProcesses } = require("./executableProcesses");
const { startProcess } = require("./startProcess");
const { stopProcess } = require("./stopProcess");
const { checkPortStatus } = require("./checkPortStatus");
const { gpusinfo } = require("./gpusinfo");

exports.win32 = {
  ...executableProcesses(),
  ...startProcess(),
  ...stopProcess(),
  ...gpusinfo(),
  ...checkPortStatus(),
  get state() {
    return state;
  }
};
