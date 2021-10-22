const fetch = require("@bebomining/server/fetch");

const baseUrl = {
  kawpow: "https://api-ravencoin.flypool.org",
  ethash: "https://api.ethermine.org",
  etchash: "https://api-etc.ethermine.org",
  autolykos2: "https://api-ergo.flypool.org"
};

const baseUnit = {
  kawpow: 1e8,
  ethash: 1e18,
  etchash: 1e18,
  autolykos2: 1e9
};

exports.stats = () => ({
  async stats({ address, workerName, algo }) {
    try {
      const baseUrlAPI = baseUrl[algo.trim().toLowerCase()];
      const hashrateProm = fetch(
        `${baseUrlAPI}/miner/${address}/worker/${workerName}/currentStats`
      ).then(res => res.json());

      const balanceProm = fetch(
        `${baseUrlAPI}/miner/${address}/currentStats`
      ).then(res => res.json());

      const chartProm = fetch(
        `${baseUrlAPI}/miner/${address}/worker/${workerName}/history`
      ).then(res => res.json());

      const [hashrateRes, balanceRes, chartRes] = await Promise.all([
        hashrateProm,
        balanceProm,
        chartProm
      ]);

      const hashrate =
        hashrateRes?.status === "OK" && hashrateRes?.data
          ? hashrateRes.data
          : null;

      const balance =
        balanceRes?.status === "OK" && balanceRes?.data
          ? balanceRes.data
          : null;

      const chart =
        chartRes?.status === "OK" && chartRes?.data?.length > 0
          ? chartRes.data
          : null;

      return { hashrate, balance, chart, algo, baseUnit: baseUnit[algo] };
    } catch {
      const error = new Error("Pool stats not available!");
      error.statusCode = 500;
      throw error;
    }
  }
});
