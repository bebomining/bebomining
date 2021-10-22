const add = state => ({
  async add({ coinName, address, walletName }) {
    const target = "INSERT INTO coins(coinName, address, walletName)";
    const result = await state.db.insert(target, [
      coinName,
      address,
      walletName
    ]);
    return result;
  }
});

exports.add = add;
