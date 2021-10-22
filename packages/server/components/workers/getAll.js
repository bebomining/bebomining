const getAll = state => ({
  async getAll(filters = {}) {
    const WHERE = Object.keys(filters)
      ?.map(key => `workers.${key} = ?`)
      ?.join(" ");

    const baseSql = `SELECT * FROM workers INNER JOIN coins ON coins.coinName = workers.coinName AND coins.walletName = workers.walletName`;

    if (typeof WHERE === "string" && WHERE.trim().length > 0) {
      const values = Object.values(filters).map(val => val.toLowerCase());
      const sql = `${baseSql} WHERE ${WHERE}`;
      const results = await state.db.selectAll(sql, values);
      return results || [];
    } else {
      const sql = baseSql;
      const results = await state.db.selectAll(sql);
      return results;
    }
  }
});

exports.getAll = getAll;
