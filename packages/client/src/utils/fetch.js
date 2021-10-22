export async function fetch(url, opts = {}) {
  opts.method = opts.method || "GET";
  opts.headers = opts.headers || {};

  if (!opts.headers?.["Content-Type"] && !(opts?.body instanceof FormData)) {
    opts.headers["Content-Type"] = "application/json";
  }

  if (typeof opts.body !== "undefined" && !(opts?.body instanceof FormData)) {
    opts.body = JSON.stringify(opts.body);
  }

  const res = await window.fetch(url, opts);
  if (res.status >= 400) {
    const defaultErrorMsg = `FetchError: ${res.status} ${res.statusText}`;
    const error = new Error(defaultErrorMsg);
    error.statusCode = res.status;
    error.url = url;
    error.method = opts.method;

    try {
      const errorBody = await res.json();
      const errorMsg = errorBody.error || defaultErrorMsg;
      error.message = errorMsg;
    } finally {
      throw error;
    }
  }
  return res;
}
