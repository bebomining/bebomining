const getWallet = state => ({
  async getWallet(filters = {}) {
    const WHERE = Object.keys(filters)
      ?.map(key => `${key} = ?`)
      ?.join(" ");

    if (typeof WHERE === "string" && WHERE.trim().length > 0) {
      const values = Object.values(filters).map(val => val.toLowerCase());
      const sql = `SELECT * FROM wallets WHERE ${WHERE}`;
      const results = await state.db.selectAll(sql, values);
      return results || [];
    } else {
      const sql = `SELECT * FROM wallets`;
      const results = await state.db.selectAll(sql);
      return results || [];
    }
  }
});

exports.getWallet = getWallet;
