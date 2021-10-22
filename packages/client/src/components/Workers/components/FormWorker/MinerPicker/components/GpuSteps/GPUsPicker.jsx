import React, { useEffect, useState } from "react";
import { useSelector } from "usetheform";

import { Select } from "./../../../../../../Select/Select";
import { useFetch } from "./../../../../../../../hooks/useFetch";
import { useAppContext } from "./../../../../../../../hooks/useAppContext";
import { useNotificationError } from "./../../../../../../../hooks/useNotificationError";

export function GPUsPicker({ options = [] }) {
  const { apiServer } = useAppContext();

  const [opts, setOpts] = useState(() => options);
  const [supportGPUsRegex] = useSelector(
    state => state.miner.minerInfo.supportGPUsRegex
  );

  const { loading, data, error } = useFetch(
    `${apiServer}/api/v1/gpus?processor=${supportGPUsRegex}`
  );
  useNotificationError(error);

  useEffect(() => {
    if (data && data.statusCode === 200) {
      setOpts(
        data.results.map(({ name, id }) => ({
          value: id,
          label: `${name} - id(${id})`
        }))
      );
    }
  }, [data]);

  const reduceValue = selected =>
    selected
      .map(({ value }) => Number(value))
      .sort()
      .join(",");

  const matchValue = (opts, selected) =>
    selected
      ?.split(",")
      .map(targetValue =>
        opts.find(({ value }) => Number(targetValue) === Number(value))
      );

  const isLoading = loading || loading === null;

  return (
    <Select
      matchValue={matchValue}
      reduceValue={reduceValue}
      placeholder="Select gpus..."
      isMulti
      isDisabled={isLoading}
      isLoading={isLoading}
      options={opts}
      name="gpus"
      validators={[required]}
    />
  );
}

const required = value =>
  typeof value === "string" && /^(-1)$|^\d+(,\d+)*$/.test(value)
    ? undefined
    : "required";
