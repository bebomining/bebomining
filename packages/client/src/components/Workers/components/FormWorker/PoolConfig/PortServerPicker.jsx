import React, { useEffect, useState } from "react";
import { useSelector } from "usetheform";
import { Select } from "./../../../../Select/Select";
import { useFetch } from "./../../../../../hooks/useFetch";
import { useAppContext } from "./../../../../../hooks/useAppContext";
import { useNotificationError } from "./../../../../../hooks/useNotificationError";

export function PortServerPicker({ options = [], onChangeValue }) {
  const { apiServer } = useAppContext();

  const [poolName] = useSelector(state => state.poolConfig.poolName);
  const [poolRegion] = useSelector(state => state.poolConfig.poolRegion);

  const [opts, setOpts] = useState(() => options);

  const { loading, data, error } = useFetch(
    `${apiServer}/api/v1/pools/${poolName}/regions?serverName=${poolRegion}`
  );
  useNotificationError(error);

  useEffect(() => {
    if (data && data.statusCode === 200) {
      const { ports: defaulPorts } = data.meta;

      const [regionPicked] = data.results;

      const ports = regionPicked?.ports || defaulPorts;

      const label = {
        0: port => `${port} - (Suggested)`,
        1: port => `${port} - (Alternative)`,
        2: port => `${port} - (Alternative)`
      };

      const useLabel = ports?.length > 1;
      ports &&
        setOpts(
          ports.map((value, index) => ({
            value,
            label: useLabel ? label[index](value) : value
          }))
        );
    }
  }, [data]);

  const isLoading = loading || loading === null;

  return (
    <Select
      placeholder="Select the port..."
      onChangeValue={onChangeValue}
      isDisabled={isLoading}
      isLoading={isLoading}
      options={opts}
      name="poolPort"
      validators={[required]}
    />
  );
}

const required = value => (typeof value === "string" ? undefined : "required");
