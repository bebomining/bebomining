import React, { useEffect, useState } from "react";
import { useSelector } from "usetheform";
import { Select } from "./../../../../Select/Select";
import { useFetch } from "./../../../../../hooks/useFetch";
import { useAppContext } from "./../../../../../hooks/useAppContext";
import { useNotificationError } from "./../../../../../hooks/useNotificationError";

export function Coins({ options = [] }) {
  const { apiServer } = useAppContext();

  const [opts, setOpts] = useState(() => options);
  const [poolName] = useSelector(state => state.poolConfig.poolName);
  const [algo] = useSelector(state => state.poolConfig.algo);

  const { loading, data, error } = useFetch(
    `${apiServer}/api/v1/pools/${poolName}/coins?algo=${algo}`
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
    <Select
      placeholder="Select a coin..."
      isDisabled={isLoading}
      isLoading={isLoading}
      options={opts}
      name="coinName"
      validators={[required]}
    />
  );
}

const required = value => (typeof value === "string" ? undefined : "required");
