const fetch = require("@bebomining/server/fetch");

exports.stats = config => ({
  async stats(worker) {
    try {
      const { portStat } = worker;

      const res = await fetch(`http://localhost:${portStat}/2/summary`);
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
  const results = payload["results"] || {};
  const cpu = payload["cpu"] || {};
  const hashrate = payload["hashrate"] || {};
  return {
    session: {
      uptime: payload["uptime"],
      validShares: results["shares_good"],
      totalShares: results["shares_total"],
      performanceUnit: "H/s",
      performance: hashrate.total[0]
    },
    cpus: [
      {
        name: cpu["brand"],
        cores: cpu["cores"],
        threads: cpu["threads"],
        performance: hashrate?.total?.[0],
        performanceHighest: hashrate?.highest
      }
    ]
  };
}
