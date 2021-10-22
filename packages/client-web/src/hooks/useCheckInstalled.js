import { useFetch } from "./useFetch";

export function useCheckInstalled({ minerName }) {
  const { loading, data, error } = useFetch(`miners/${minerName}/_installed`);

  return { checking: loading, data, error };
}
