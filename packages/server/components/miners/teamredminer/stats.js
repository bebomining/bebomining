const { Socket } = require("net");

exports.stats = config => ({
  async stats(worker) {
    try {
      const payload = await callServerStats(worker);
      return { ...mapper(payload), worker };
    } catch {
      const error = new Error(
        `Error fetching stats from miner: '${config.name}' - worker id : ${worker.id} - port ${worker.portStat}`
      );
      error.statusCode = 500;
      throw error;
    }
  }
});

function mapper(payload = {}) {
  const session = payload?.session || {};
  const gpus = payload?.gpus || [];
  const mapGpus = gpus.map(targetGPU => ({
    idGpu: targetGPU["GPU"],
    accepted: targetGPU["Accepted"],
    rejected: targetGPU["Rejected"],
    performance: targetGPU["MHS 30s"],
    power: targetGPU["GPU Power"],
    fanSpeed: targetGPU["Fan Percent"],
    temp: targetGPU["Temperature"],
    restartCounter: targetGPU["Hardware Errors"] || "0"
  }));
  return {
    session: {
      uptime: session["Elapsed"] || 0,
      activeGPUs: mapGpus.length,
      totalPower: mapGpus.reduce((acc, { power }) => acc + power, 0),
      performanceUnit: "MH/s",
      performance: session["MHS 30s"]
    },
    gpus: mapGpus
  };
}

function callServerStats(worker) {
  return new Promise((resolve, reject) => {
    const { portStat } = worker;
    const client = new Socket();
    client.connect(portStat, "localhost", function () {
      client.write(`{"command": "summary+devs" }`);
    });

    client.on("data", function (data) {
      const res = JSON.parse(data);
      const payload = {
        session: res.summary.SUMMARY[0],
        gpus: res.devs.DEVS
      };
      client.destroy();
      resolve(payload);
    });

    client.on("error", function (err) {
      reject(err.message);
    });
  });
}
