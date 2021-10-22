const add = state => ({
  async add({
    workerName,
    poolName,
    poolRegion,
    poolPort,
    coinName,
    minerName,
    minerAssetId,
    minerTagName,
    gpus,
    algo,
    walletName,
    minerMode
  }) {
    const target =
      "INSERT INTO workers(workerName, poolName, poolRegion, poolPort, coinName, algo, walletName, minerName, minerAssetId, minerTagName, gpus, minerMode)";
    const result = await state.db.insert(target, [
      workerName,
      poolName,
      poolRegion,
      poolPort,
      coinName,
      algo,
      walletName,
      minerName,
      minerAssetId,
      minerTagName,
      gpus,
      minerMode
    ]);

    return result;
  }
});

exports.add = add;
