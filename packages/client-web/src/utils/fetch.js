export function fetch(namespace, opts = {}) {
  opts.method = opts.method || "GET";
  opts.headers = opts.headers || {};

  if (!opts.headers?.["Content-Type"] && !(opts?.body instanceof FormData)) {
    opts.headers["Content-Type"] = "application/json";
  }

  const id = Date.now();
  window._SOCKET.send({ namespace, opts, id });
  return new Promise((resolve, reject) => {
    const cb = api => {
      window._BUS.off(`${namespace}-${id}`, cb);
      console.log("FETCH END => ", `${namespace}-${id}`, api);
      if (api.err) {
        reject(api.err);
      } else {
        resolve(api);
      }
    };
    window._BUS.on(`${namespace}-${id}`, cb);
  });
}
