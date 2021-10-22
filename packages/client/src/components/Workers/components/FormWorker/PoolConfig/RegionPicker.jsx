import React, { useEffect, useState } from "react";

import { useSelector } from "usetheform";
import { Select } from "./../../../../Select/Select";
import { useFetch } from "./../../../../../hooks/useFetch";
import { useAppContext } from "./../../../../../hooks/useAppContext";
import { useNotificationError } from "./../../../../../hooks/useNotificationError";

const noop = () => null;
export function RegionPicker({ options = [], onChangeValue }) {
  const { apiServer } = useAppContext();

  const [poolName] = useSelector(state => state.poolConfig.poolName);
  const [algo] = useSelector(state => state.poolConfig.algo);

  const [meta, setMeta] = useState(() => ({}));

  const [opts, setOpts] = useState(() => options);
  const { loading, data, error } = useFetch(
    `${apiServer}/api/v1/pools/${poolName}/regions?algo=${algo.toLowerCase()}`
  );
  useNotificationError(error);

  useEffect(() => {
    if (data && data.statusCode === 200) {
      setMeta(data.meta);
      setOpts(
        data.results.map(({ location, server }) => ({
          value: `${server}`.trim(),
          label: `${server} - (${location})`
        }))
      );
    }
  }, [data]);

  const isLoading = loading || loading === null;
  const { multiRegion } = meta;

  const reduceValue = selected =>
    selected
      .map(({ value }) => value.toLowerCase())
      .sort()
      .join(",");

  const matchValue = (opts, selected) =>
    selected
      ?.split(",")
      .map(targetValue =>
        opts.find(
          ({ value }) => targetValue.toLowerCase() === value.toLowerCase()
        )
      );

  return (
    <Select
      reduceValue={multiRegion ? reduceValue : null}
      matchValue={multiRegion ? matchValue : null}
      isMulti={multiRegion}
      placeholder="Select the server region..."
      onChangeValue={multiRegion ? noop : onChangeValue}
      isDisabled={isLoading}
      isLoading={isLoading}
      options={opts}
      name="poolRegion"
      validators={[required]}
      isOptionDisabled={optionsPicked =>
        multiRegion && optionsPicked?.length >= 2
      }
    />
  );
}

const required = value => (typeof value === "string" ? undefined : "required");
