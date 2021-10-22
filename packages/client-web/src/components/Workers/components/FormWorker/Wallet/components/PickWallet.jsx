import React, { useEffect, useState } from "react";
import { Select } from "../../../../../Select/Select";
import { useFetch } from "../../../../../../hooks/useFetch";
import { useNotificationError } from "../../../../../../hooks/useNotificationError";

export function PickWallet({ options = [], onChangeValue }) {
  const [opts, setOpts] = useState(() => options);

  const { loading, data, error } = useFetch(`wallets`);
  useNotificationError(error);

  useEffect(() => {
    if (data && data.statusCode === 200) {
      setOpts(
        data.results.map(({ walletName }) => ({
          value: walletName,
          label: walletName
        }))
      );
    }
  }, [data]);

  const isLoading = loading || loading === null;

  return (
    <Select
      placeholder="Pick a wallet..."
      onChangeValue={onChangeValue}
      isDisabled={isLoading}
      isLoading={isLoading}
      options={opts}
      name="walletName"
      validators={[required]}
    />
  );
}

const required = value => (typeof value === "string" ? undefined : "required");
