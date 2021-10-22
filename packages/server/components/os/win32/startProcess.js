const { spawn } = require("child_process");
const { electron } = require("@bebomining/server/electron");
const Convert = require("ansi-to-html");
const convert = new Convert({
  newline: true
});

const startProcess = () => ({
  async startProcess({ exePath, args, worker }) {
    return new Promise((resolve, reject) => {
      const ls = spawn(exePath, args);
      let isFullFilled = false;
      const pid = ls.pid;

      // replace with ls.on("spawn", ...) node v15.1.0
      ls.on("spawn", () => {
        if (!isFullFilled) {
          console.log("running PID=> ", pid);
          isFullFilled = true;
          setTimeout(() => resolve(pid), 3500);
        }
      });

      ls.on("exit", function (code) {
        if (!isFullFilled) {
          isFullFilled = true;
          reject(code);
        }
      });

      ls.on("error", function (error) {
        if (!isFullFilled) {
          isFullFilled = true;
          reject(error);
        }
      });

      if (worker) {
        let output = "";
        const { workerName } = worker;
        ls.stdout.on("data", function (data) {
          output += data.toString();
          if (output.length >= 60000) {
            output = output.slice(-60000);
          }
          const html = convert.toHtml(output);
          electron.win.webContents.send(`log_${workerName}`, html);
          global._eventEmitter.emit(`log_${pid}`, html);
        });
      }
    });
  }
});

exports.startProcess = startProcess;
