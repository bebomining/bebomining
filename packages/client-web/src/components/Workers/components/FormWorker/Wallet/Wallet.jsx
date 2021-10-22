import React, { useEffect, useState } from "react";
import { useSelector, PersistStateOnUnmount } from "usetheform";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

import { makeStyles } from "@material-ui/core/styles";

import { Select } from "./../../../../Select/Select";
import { useFetch } from "./../../../../../hooks/useFetch";
import { useNotificationError } from "./../../../../../hooks/useNotificationError";

import { AddNewCoinForm } from "./components/AddNewCoinForm";

export function Wallet({ options = [] }) {
  const classes = useStyles();

  const [opts, setOpts] = useState(() => options);
  const [coinName] = useSelector(state => state.coinName);

  const [showWalletForm, openWallet] = useState(() => false);
  const toggleWalletForm = () => openWallet(prev => !prev);

  const { loading, data, error } = useFetch(
    `coins?coinName=${encodeURIComponent(coinName)}`
  );
  useNotificationError(error);

  useEffect(() => {
    if (data && data.statusCode === 200) {
      setOpts(
        data.results.map(({ address, walletName }) => ({
          value: walletName,
          label: `${walletName}:${address}`
        }))
      );
    }
  }, [data]);

  const isLoading = loading || loading === null;
  const hasNoWallets = data?.results?.length <= 0;

  return (
    <>
      {!hasNoWallets && (
        <PersistStateOnUnmount>
          <div
            style={{ maxWidth: "624px", padding: "0px 24px", margin: "auto" }}
          >
            <Select
              placeholder={`Select a wallet for: ${coinName}`}
              isDisabled={isLoading}
              isLoading={isLoading}
              options={opts}
              name="walletName"
              validators={[required]}
            />
          </div>
        </PersistStateOnUnmount>
      )}

      {hasNoWallets && (
        <div className={classes.NoWallets}>
          <Typography color="textSecondary" gutterBottom>
            None of your wallets contains the coin: <b>{coinName}</b>
          </Typography>
          <Button
            size="small"
            variant="contained"
            disableElevation
            color="primary"
            startIcon={<AddIcon />}
            onClick={toggleWalletForm}
          >
            Add {coinName} to a Wallet
          </Button>
        </div>
      )}
      {showWalletForm && (
        <AddNewCoinForm
          toggleWalletForm={toggleWalletForm}
          coinName={coinName}
        />
      )}
    </>
  );
}

const required = value => (typeof value === "string" ? undefined : "required");

const useStyles = makeStyles(() => ({
  NoWallets: {
    width: "100%",
    height: "80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative"
  }
}));
