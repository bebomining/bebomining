import { useState } from "react";
import { useAppContext } from "./useAppContext";

export function useInstallAsset() {
  const { apiServer } = useAppContext();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const install = async props => {
    setLoading(true);
    try {
      const res = await fetch(`${apiServer}/api/v1/miners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(props)
      });

      if (res.status >= 400) {
        throw new Error(`Error downloading: ${props.minerName}! Try again!`);
      }

      const data = await res.json();
      if (data.statusCode !== 201) {
        throw new Error(
          `Error installing: ${props.minerName} - releaseId: ${releaseId}`
        );
      }
      setLoading(false);
      setData(data);

      return Promise.resolve();
    } catch (err) {
      setLoading(false);
      setError(err);
      return Promise.reject();
    }
  };

  return { loading, install, error, data };
}
