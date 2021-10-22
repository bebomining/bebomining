import React, { useEffect, useState } from "react";
import { useSelector } from "usetheform";
import { Select } from "./../../../../Select/Select";
import { useFetch } from "./../../../../../hooks/useFetch";
import { useNotificationError } from "./../../../../../hooks/useNotificationError";

export function Coins({ options = [] }) {
  const [opts, setOpts] = useState(() => options);
  const [poolName] = useSelector(state => state.poolConfig.poolName);
  const [algo] = useSelector(state => state.poolConfig.algo);

  const { loading, data, error } = useFetch(
    `pools/${poolName}/coins?algo=${algo}`
  );
  useNotificationError(error);

  useEffect(() => {
    if (data && data.statusCode === 200) {
      setOpts(
        data.results.map(({ symbol }) => ({
          value: symbol.toUpperCase(),
          label: symbol.toUpperCase()
        }))
      );
    }
  }, [data]);

  const isLoading = loading || loading === null;

  return (
    <div style={{ maxWidth: "624px", padding: "0px 24px", margin: "auto" }}>
      <Select
        placeholder="Select a coin..."
        isDisabled={isLoading}
        isLoading={isLoading}
        options={opts}
        name="coinName"
        validators={[required]}
      />
    </div>
  );
}

const required = value => (typeof value === "string" ? undefined : "required");
