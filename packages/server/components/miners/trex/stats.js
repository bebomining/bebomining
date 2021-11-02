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

const hs = 1e6;
function mapper(payload = {}) {
  const watchdogStat = payload?.["watchdog_stat"] || {};
  const gpus = payload?.gpus || [];
  return {
    session: {
      uptime: watchdogStat["uptime"],
      activeGPUs: payload["gpu_total"],
      totalPower: gpus.reduce((acc, { power }) => acc + power, 0),
      performanceUnit: "MH/s",
      performance: payload["hashrate"] / hs
    },
    gpus: gpus.map(targetGPU => ({
      idGpu: targetGPU["gpu_id"],
      name: targetGPU["name"],
      performance: targetGPU["hashrate"] / hs,
      power: targetGPU["power"],
      fanSpeed: targetGPU["fan_speed"],
      temp: targetGPU["temperature"],
      restartCounter:
        watchdogStat?.["gpu_with_errors"]?.[targetGPU["gpu_id"]] || "0"
    }))
  };
}
