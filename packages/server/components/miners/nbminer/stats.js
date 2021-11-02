const fetch = require("@bebomining/server/fetch");

exports.stats = config => ({
  async stats(worker) {
    try {
      const { portStat } = worker;

      const res = await fetch(`http://localhost:${portStat}/api/v1/status`);
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
  const miner = payload?.["miner"] || {};
  const gpus = miner?.["devices"] || [];
  const startTime = (payload?.["start_time"] || 0) * 1000;
  const uptime = (Date.now() - startTime) / 1000;
  return {
    session: {
      uptime,
      activeGPUs: gpus.length,
      totalPower: miner["total_power_consume"],
      performanceUnit: "MH/s",
      performance:
        miner["total_hashrate_raw"] > 0 ? miner["total_hashrate_raw"] / 1e6 : 0
    },
    gpus: gpus.map(targetGPU => ({
      idGpu: targetGPU["id"],
      name: targetGPU["info"],
      performance:
        targetGPU["hashrate_raw"] > 0 ? targetGPU["hashrate_raw"] / 1e6 : 0,
      power: targetGPU["power"],
      fanSpeed: targetGPU["fan"],
      temp: targetGPU["temperature"]
    }))
  };
}
