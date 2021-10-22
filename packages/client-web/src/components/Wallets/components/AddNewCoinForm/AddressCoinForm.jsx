import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Collection, useSelector } from "usetheform";
import { TextField } from "./../../../TextField/TextField";

export function AddressCoinForm({ walletName }) {
  const classes = useStyles();

  const [coinName] = useSelector(state => state.coinName);

  const conins = coinName.split("+");

  return (
    <Collection array name="addresses">
      {conins.map((name, index) => (
        <TextField
          key={name}
          index={index}
          className={classes.TextField}
          autoFocus={index === 0}
          helperText={`Add a valid '${name}' Address - Wallet: '${walletName}'`}
          validators={[isValidAddress]}
          label={`Type your '${name}' Address...`}
          variant="outlined"
        />
      ))}
    </Collection>
  );
}

const isValidAddress = value =>
  typeof value === "string" && value.trim().length >= 5
    ? undefined
    : "Address not valid";

const useStyles = makeStyles(() => ({
  TextField: {
    marginTop: "4px",
    marginBottom: "32px"
  }
}));
