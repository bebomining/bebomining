const replace = state => ({
  async replace({
    id,
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
      "UPDATE workers SET workerName = ?, poolName = ?, poolRegion = ?, poolPort = ?, coinName = ?, algo = ?, walletName = ?, minerName = ?, minerAssetId = ?, minerTagName = ?, gpus = ?, minerMode = ? WHERE id = ?";

    const result = await state.db.replace(target, [
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
      minerMode,
      id
    ]);

    return result;
  }
});

exports.replace = replace;
