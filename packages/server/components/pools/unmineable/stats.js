const fetch = require("@bebomining/server/fetch");

const baseURLV4 = "https://api.unminable.com/v4";

exports.stats = () => ({
  async stats({ address, coinName, workerName, algo }) {
    try {
      const addressInfo = await fetch(
        `${baseURLV4}/address/${address}?coin=${coinName.toUpperCase()}`
      ).then(res => res.json());
      const uuid = addressInfo.data.uuid;

      const stats = await fetch(`${baseURLV4}/account/${uuid}/stats`).then(
        res => res.json()
      );

      const {
        balance_mining,
        balance_referral,
        rewarded: { past_24h },
        mining_fee: miningFee
      } = stats.data;

      const algoName =
        algo.toLowerCase() === "rx" ? "randomx" : algo.toLowerCase();

      const balance = {
        balance: balance_mining,
        total24h: past_24h,
        referralBalance: balance_referral,
        miningFee
      };

      const { data = {} } = await fetch(
        `${baseURLV4}/account/${uuid}/workers`
      ).then(res => res.json());

      const cleanWorkerName = workerName.split("#")[0];
      const workerStats = data[algoName];

      const workerOnline = workerStats.workers.find(
        ({ name, online = true }) =>
          online && name.trim() === cleanWorkerName.trim()
      );

      const performanceUnit = algo.toLowerCase() === "rx" ? "H/s" : "MH/s";
      const hashrate = workerOnline
        ? {
            reportedHashrate: workerOnline.rhr,
            currentEffectiveHashrate: workerOnline.chr,
            performanceUnit
          }
        : undefined;

      const chart = workerStats.chart;
      return { hashrate, balance, chart };
    } catch {
      const error = new Error("Pool stats not available!");
      error.statusCode = 500;
      throw error;
    }
  }
});
