export async function waitPromiseTimeout(targetPromise, timeout = 1600) {
  const waitMin = new Promise(resolve => setTimeout(resolve, timeout));
  const [result] = await Promise.all([targetPromise, waitMin]);
  return result;
}
