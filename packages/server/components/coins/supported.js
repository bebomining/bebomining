const pools = require("@bebomining/server/pools");

const supported = () => ({
  async supported() {
    const coinsPromises = Object.values(pools).map(pool => pool.coins());
    const coinslists = await Promise.all(coinsPromises);
    const result = coinslists
      .reduce((acc, list) => [...acc, ...list], [])
      .map(({ symbol, network }) => ({ symbol, network }))
      .filter(
        ({ symbol }, index, self) =>
          index === self.findIndex(t => t.symbol === symbol)
      );
    return result;
  }
});

exports.supported = supported;
