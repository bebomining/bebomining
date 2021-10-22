import { useAppContext } from "./useAppContext";
import { useFetch } from "./useFetch";

export function useCheckInstalled({ minerName }) {
  const { apiServer } = useAppContext();

  const { loading, data, error } = useFetch(
    `${apiServer}/api/v1/miners/${minerName}/_installed`
  );

  return { checking: loading, data, error };
}
