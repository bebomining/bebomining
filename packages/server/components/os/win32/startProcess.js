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
      let that = this;

      // replace with ls.on("spawn", ...) node v15.1.0
      ls.on("spawn", async () => {
        if (!isFullFilled) {
          isFullFilled = true;
          const miners = require("@bebomining/server/miners");
          const wokerMiner = miners[worker.minerName];
          if (typeof wokerMiner === "undefined") {
            const err = new Error(
              `Worker with miner: ${worker.minerName} did not start!`
            );
            try {
              await that.stopProcess({ pid });
            } finally {
              reject(err);
            }
          }

          let counter = 0;
          async function waitForAPI() {
            try {
              await wokerMiner.stats(worker);
              resolve(pid);
            } catch {
              counter++;
              if (counter <= 40) {
                setTimeout(() => waitForAPI(), 1500);
              } else {
                const err = new Error(
                  `Worker with miner: ${worker.minerName} did not start!`
                );
                try {
                  await that.stopProcess({ pid });
                } finally {
                  reject(err);
                }
              }
            }
          }
          setTimeout(() => waitForAPI(), 3500);
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

      ls.on("close", code => {
        console.log(`child process exited with code ${code}`);
      });

      if (worker) {
        const { workerName } = worker;
        let output = "";
        function sendLogs(data) {
          output += data.toString();
          if (output.length >= 60000) {
            output = output.slice(-60000);
          }
          const html = convert.toHtml(output);
          electron.win.webContents.send(`log_${workerName}`, html);
          global._eventEmitter.emit(`log_${pid}`, html);
        }

        ls.stderr.on("data", data => {
          sendLogs(data);
        });
        ls.stdout.on("data", data => {
          sendLogs(data);
        });
      }
    });
  }
});

exports.startProcess = startProcess;
