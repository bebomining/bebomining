const fetch = require("@bebomining/server/fetch");

exports.stats = config => ({
  async stats(worker) {
    try {
      const { portStat } = worker;

      const res = await fetch(`http://localhost:${portStat}/summary`);
      const payload = await res.json();

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
  const session = payload?.["Session"] || {};
  const gpus = payload?.["GPUs"] || [];
  return {
    session: {
      uptime: session["Uptime"],
      activeGPUs: session["Active_GPUs"],
      totalPower: session["TotalPower"],
      performanceUnit: session["Performance_Unit"],
      performance: session["Performance_Summary"]
    },
    gpus: gpus.map(targetGPU => ({
      idGpu: targetGPU["Index"],
      name: targetGPU["Name"],
      performance: targetGPU["Performance"],
      power: targetGPU["Consumption (W)"],
      fanSpeed: targetGPU["Fan Speed (%)"],
      temp: targetGPU["Temp (deg C)"]
    }))
  };
}
