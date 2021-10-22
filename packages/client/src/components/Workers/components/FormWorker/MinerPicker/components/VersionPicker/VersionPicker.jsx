import React, { useEffect, useState } from "react";
import { useSelector } from "usetheform";

import { Select } from "./../../../../../../Select/Select";
import { useFetch } from "./../../../../../../../hooks/useFetch";
import { useAppContext } from "./../../../../../../../hooks/useAppContext";
import { useNotificationError } from "./../../../../../../../hooks/useNotificationError";

export function VersionPicker({ options = [], modeTarget, onChangeValue }) {
  const { apiServer } = useAppContext();

  const [opts, setOpts] = useState(() => options);
  const [algo] = useSelector(state => state.poolConfig.algo);

  const { loading, data, error } = useFetch(
    `${apiServer}/api/v1/miners/_installed?algo=${algo}`
  );
  useNotificationError(error);

  const matchValue = (opts, target) =>
    opts.find(({ value }) => value?.minerAssetId === target?.minerAssetId);

  useEffect(() => {
    if (data && data.statusCode === 200) {
      setOpts(
        data.results
          .filter(
            ({ minerMode }) =>
              minerMode.toLowerCase() === modeTarget.toLowerCase()
          )
          .map(({ minerName, assetId, tagName, supportGPUsRegex }) => ({
            value: {
              minerName,
              minerAssetId: assetId,
              minerTagName: tagName,
              supportGPUsRegex
            },
            label: `${minerName}: ${tagName}`
          }))
      );
    }
  }, [data]);

  const isLoading = loading || loading === null;

  return (
    <Select
      placeholder="Select a miner tool..."
      isDisabled={isLoading}
      isLoading={isLoading}
      options={opts}
      matchValue={matchValue}
      onChangeValue={onChangeValue}
      name="minerInfo"
      validators={[required]}
    />
  );
}

const required = value =>
  value && typeof value.minerAssetId === "number" ? undefined : "required";
