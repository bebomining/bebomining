const add = state => ({
  async add({ walletName }) {
    const target = "INSERT INTO wallets(walletName)";
    const result = await state.db.insert(target, [walletName]);
    return result;
  }
});

exports.add = add;
