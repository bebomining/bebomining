const get = state => ({
  async get({ id }) {
    const sql = `SELECT * FROM workers INNER JOIN coins ON coins.coinName = workers.coinName AND coins.walletName = workers.walletName WHERE id = ?`;
    const result = await state.db.selectWhere(sql, [id]);
    return result;
  }
});

exports.get = get;
