const fetch = require("@bebomining/server/fetch");

module.exports = function fetchWithTimeout(
  url,
  { options, timeout = 3000, fallback }
) {
  return Promise.race([
    new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(url, options);
        resolve(res);
      } catch (err) {
        if (fallback) {
          resolve({ fallback: true, json: async () => fallback });
        } else {
          reject(err);
        }
      }
    }),
    new Promise((resolve, reject) =>
      setTimeout(() => {
        if (fallback) {
          resolve({ fallback: true, json: async () => fallback });
        } else {
          reject(new Error("timeout"));
        }
      }, timeout)
    )
  ]);
};
