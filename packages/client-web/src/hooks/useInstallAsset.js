import { useState } from "react";
import { fetch } from "./../utils";

export function useInstallAsset() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const install = async props => {
    setLoading(true);
    try {
      const data = await fetch(`miners`, {
        method: "POST",
        body: props
      });

      if (data.statusCode !== 201) {
        throw new Error(
          `Error installing: ${props.minerName} - releaseId: ${releaseId}`
        );
      }
      setLoading(false);
      setData(data);
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  };

  return { loading, install, error, data };
}
