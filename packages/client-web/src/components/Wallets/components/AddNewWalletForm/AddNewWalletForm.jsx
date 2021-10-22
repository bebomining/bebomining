import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Form } from "usetheform";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import BackIcon from "@material-ui/icons/KeyboardBackspace";
import Button from "@material-ui/core/Button";

import { SubmitFormButton } from "./../../../SubmitFormButton/SubmitFormButton";
import { TextField } from "./../../../TextField/TextField";

import { useNotificationError } from "./../../../../hooks/useNotificationError";
import { fetch } from "./../../../../utils";

const useStyles = makeStyles({
  FormWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  Form: {
    display: "flex",
    flexDirection: "column",
    marginTop: "32px",
    height: "33%",
    justifyContent: "space-around"
  },
  backButton: {
    position: "absolute",
    zIndex: 2,
    top: "16px",
    left: "16px"
  }
});

export function AddNewWalletForm() {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();

  const [error, setError] = useState(null);
  useNotificationError(error);

  const goBack = () => {
    const { rigId } = match.params;
    history.push(`/rigs/${rigId}/wallets`);
  };

  const saveWallet = async state => {
    const url = `wallets`;
    const result = await fetch(url, {
      method: "POST",
      body: state
    });
    if (result.statusCode === 201) {
      const { rigId } = match.params;
      history.push(`/rigs/${rigId}/wallets`);
    }
    if (result.status === "error") {
      const errMsg = `Wallet named: '${state.walletName}' already exist!`;
      setError(new Error(errMsg));
    }

    if (result.statusCode !== 201) {
      return Promise.reject();
    }
  };

  return (
    <div className={classes.FormWrapper}>
      <Button
        size="small"
        variant="contained"
        startIcon={<BackIcon />}
        className={classes.backButton}
        disableElevation
        onClick={goBack}
      >
        Back
      </Button>

      <Typography variant="h3" component="h3">
        Add New Wallet
      </Typography>
      <Form className={classes.Form} onSubmit={saveWallet}>
        <TextField
          autoFocus
          helperText="Accept only letters and numbers...{2,16}"
          validators={[isValidName]}
          label="Type Wallet Name..."
          variant="outlined"
          name="walletName"
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SubmitFormButton size="large" startIcon={<AddIcon />}>
            Save
          </SubmitFormButton>
        </div>
      </Form>
    </div>
  );
}

const isValidName = value =>
  value && /^[a-zA-Z0-9]{2,16}$/.test(value) ? undefined : "Name not valid";
