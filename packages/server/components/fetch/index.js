const nodeFetch = require("node-fetch");

module.exports = async function fetch(url, opts = {}) {
  opts.method = opts.method || "GET";
  opts.headers = opts.headers || {};

  if (!opts.headers?.["Content-Type"]) {
    opts.headers["Content-Type"] = "application/json";
  }

  const res = await nodeFetch(url, opts);
  if (res.status >= 400) {
    const error = new Error(`FetchError: ${res.status} ${res.statusText}`);
    error.statusCode = res.status;
    error.url = url;
    error.method = opts.method;
    throw error;
  }
  return res;
};
