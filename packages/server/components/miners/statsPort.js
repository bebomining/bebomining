let port = 3000;
exports.statsPort = () => ({
  statsPort() {
    return {
      get port() {
        return port++;
      }
    };
  }
});
