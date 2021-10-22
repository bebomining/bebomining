import React, { useEffect, useState } from "react";
import { useSelector } from "usetheform";

import { Select } from "./../../../../Select/Select";
import { useFetch } from "./../../../../../hooks/useFetch";
import { useAppContext } from "./../../../../../hooks/useAppContext";
import { useNotificationError } from "./../../../../../hooks/useNotificationError";

export function NamePicker({ options = [], onChangeValue }) {
  const { apiServer } = useAppContext();

  const [opts, setOpts] = useState(() => options);

  const [minerMode] = useSelector(state => state.minerMode);

  const { loading, data, error } = useFetch(
    `${apiServer}/api/v1/pools?algo=${minerMode}`
  );
  useNotificationError(error);

  useEffect(() => {
    if (data && data.statusCode === 200) {
      setOpts(
        data.results.map(({ name }) => ({
          value: name,
          label: name
        }))
      );
    }
  }, [data]);

  const isLoading = loading || loading === null;

  return (
    <Select
      placeholder="Select a pool..."
      onChangeValue={onChangeValue}
      isDisabled={isLoading}
      isLoading={isLoading}
      options={opts}
      name="poolName"
      validators={[required]}
    />
  );
}

const required = value => (typeof value === "string" ? undefined : "required");
