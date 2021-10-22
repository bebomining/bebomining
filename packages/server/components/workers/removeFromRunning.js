const removeFromRunning = state => ({
  removeFromRunning(workerWithPid) {
    const index = state.runnings.findIndex(
      ({ id }) => Number(id) === Number(workerWithPid.id)
    );

    if (index > -1) {
      return state.runnings.splice(index, 1);
    }

    return [];
  }
});

exports.removeFromRunning = removeFromRunning;
