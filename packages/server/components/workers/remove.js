const remove = state => ({
  async remove({ id }) {
    const sql = "DELETE FROM workers WHERE id = ?";
    const result = await state.db.deleteRecord(sql, [id]);
    if (result.changes === 0) {
      const error = new Error(`Worker: ${id} not found!`);
      error.statusCode = 404;
      throw error;
    }
    return result;
  }
});

exports.remove = remove;
