import React, { useEffect, useState } from "react";
import { useSelector } from "usetheform";

import { Select } from "./../../../../../../Select/Select";
import { useFetch } from "./../../../../../../../hooks/useFetch";
import { useNotificationError } from "./../../../../../../../hooks/useNotificationError";

export function VersionPicker({ options = [], modeTarget, onChangeValue }) {
  const [opts, setOpts] = useState(() => options);
  const [algo] = useSelector(state => state.poolConfig.algo);

  const { loading, data, error } = useFetch(`miners/_installed?algo=${algo}`);
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
    <div style={{ maxWidth: "624px", padding: "0px 24px", margin: "auto" }}>
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
    </div>
  );
}

const required = value =>
  value && typeof value.minerAssetId === "number" ? undefined : "required";
