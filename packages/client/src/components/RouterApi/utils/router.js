import { fetch } from "./../../../utils";

export async function router(event, apiServer) {
  const { namespace, opts = {}, id } = event;

  let apiResult = { namespace, api: {}, id };
  try {
    const res = await fetch(`${apiServer}/api/v1/${namespace}`, opts);
    apiResult.api = await res.json();
  } catch (err) {
    apiResult.api.err = err;
    console.log(err);
  }

  return apiResult;
}
