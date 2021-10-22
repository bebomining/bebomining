import React, { useEffect, useState } from "react";
import { Select } from "./../../../Select/Select";
import { useFetch } from "./../../../../hooks/useFetch";
import { useAppContext } from "./../../../../hooks/useAppContext";
import { useNotificationError } from "./../../../../hooks/useNotificationError";

export function PickCoinTicker({ options = [], onChangeValue }) {
  const { apiServer } = useAppContext();

  const [opts, setOpts] = useState(() => options);

  const { loading, data, error } = useFetch(
    `${apiServer}/api/v1/coins/_supported`
  );
  useNotificationError(error);

  useEffect(() => {
    if (data && data.statusCode === 200) {
      setOpts(
        data.results.map(({ symbol }) => ({
          value: symbol,
          label: symbol
        }))
      );
    }
  }, [data]);

  const isLoading = loading || loading === null;

  return (
    <Select
      placeholder="Pick a coin ticker..."
      onChangeValue={onChangeValue}
      isDisabled={isLoading}
      isLoading={isLoading}
      options={opts}
      name="coinName"
      validators={[required]}
    />
  );
}

const required = value => (typeof value === "string" ? undefined : "required");
