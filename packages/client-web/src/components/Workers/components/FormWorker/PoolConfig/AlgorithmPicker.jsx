import React, { useEffect, useState } from "react";
import { Select } from "./../../../../Select/Select";
import { useFetch } from "./../../../../../hooks/useFetch";
import { useNotificationError } from "./../../../../../hooks/useNotificationError";
import { useSelector } from "usetheform";

export function AlgorithmPicker({ options = [], onChangeValue }) {
  const [opts, setOpts] = useState(() => options);
  const [poolName] = useSelector(state => state.poolConfig.poolName);
  const [minerMode] = useSelector(state => state.minerMode);

  const { loading, data, error } = useFetch(
    `pools/${poolName}/algos/${minerMode.toLowerCase()}`
  );
  useNotificationError(error);

  useEffect(() => {
    if (data && data.statusCode === 200) {
      setOpts(
        data.results.map(({ value, label }) => ({
          value: value,
          label: label.toUpperCase()
        }))
      );
    }
  }, [data]);

  const isLoading = loading || loading === null;

  return (
    <Select
      placeholder="Select an algorithm..."
      isDisabled={isLoading}
      isLoading={isLoading}
      options={opts}
      onChangeValue={onChangeValue}
      name="algo"
      validators={[required]}
    />
  );
}

const required = value => (typeof value === "string" ? undefined : "required");
