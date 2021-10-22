const fetch = require("@bebomining/server/fetch");

const baseUrlAPI = "https://stats.ezil.me";
const baseUrlAPIBalance = "https://billing.ezil.me";

exports.stats = () => ({
  async stats({ address, workerName }) {
    try {
      const hashrateProm = fetch(
        `${baseUrlAPI}/current_stats/${address}/workers`
      ).then(res => res.json());

      const balanceProm = fetch(
        `${baseUrlAPIBalance}/balances/${address}`
      ).then(res => res.json());

      const timeToNow = new Date();
      const timeFrom = new Date();
      timeFrom.setHours(timeFrom.getHours() - 12);

      const chartProm = fetch(
        `${baseUrlAPI}/historical_stats/${address}/${workerName}?time_from=${timeFrom.toISOString()}&time_to=${timeToNow.toISOString()}`
      ).then(res => res.json());

      const ratesProm = fetch(`${baseUrlAPIBalance}/rates`).then(res =>
        res.json()
      );

      const [hashrateRes, balanceRes, chartRes, ratesRes] = await Promise.all([
        hashrateProm,
        balanceProm,
        chartProm,
        ratesProm
      ]);

      const hashrate = hashrateRes
        ? hashrateRes.find(({ worker }) => workerName === worker)
        : null;

      const balance = balanceRes ? balanceRes : null;

      const chart = chartRes && chartRes?.length > 0 ? chartRes : null;

      const rates = ratesRes ? ratesRes : null;

      const defaultsharesValues = {
        validShares: 0,
        staleShares: 0,
        invalidShares: 0
      };

      const sharesValues = chart
        ? chart.reduce(
            (
              acc,
              {
                accepted_shares_count,
                invalid_shares_count,
                stale_shares_count
              }
            ) => {
              acc.validShares += accepted_shares_count;
              acc.invalidShares += invalid_shares_count;
              acc.staleShares += stale_shares_count;

              return acc;
            },
            defaultsharesValues
          )
        : defaultsharesValues;

      return {
        hashrate: { ...hashrate, ...sharesValues },
        balance,
        chart,
        rates
      };
    } catch {
      const error = new Error("Pool stats not available!");
      error.statusCode = 500;
      throw error;
    }
  }
});
