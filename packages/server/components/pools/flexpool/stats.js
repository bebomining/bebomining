const fetch = require("@bebomining/server/fetch");

const baseUrlAPI = "https://api.flexpool.io/v2";
exports.stats = () => ({
  async stats({ address, coinName, workerName }) {
    try {
      const hashrateProm = fetch(
        `${baseUrlAPI}/miner/stats?address=${address}&coin=${coinName.toLowerCase()}&worker=${workerName}`
      ).then(res => res.json());

      const balanceProm = fetch(
        `${baseUrlAPI}/miner/balance?address=${address}&coin=${coinName.toLowerCase()}`
      ).then(res => res.json());

      const chartProm = fetch(
        `${baseUrlAPI}/miner/chart?address=${address}&coin=${coinName.toLowerCase()}&worker=${workerName}`
      ).then(res => res.json());

      const [hashrateRes, balanceRes, chartRes] = await Promise.all([
        hashrateProm,
        balanceProm,
        chartProm
      ]);

      const hashrate =
        hashrateRes.error === null && hashrateRes?.result
          ? hashrateRes.result
          : null;

      const balance =
        balanceRes.error === null && balanceRes?.result
          ? balanceRes.result
          : null;

      const chart =
        chartRes.error === null && chartRes?.result?.length > 0
          ? chartRes.result
          : null;

      return { hashrate, balance, chart };
    } catch {
      const error = new Error("Pool stats not available!");
      error.statusCode = 500;
      throw error;
    }
  }
});
