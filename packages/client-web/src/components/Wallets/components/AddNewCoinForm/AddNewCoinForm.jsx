import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { Form, Input, PersistStateOnUnmount } from "usetheform";
import AddIcon from "@material-ui/icons/Add";
import BackIcon from "@material-ui/icons/KeyboardBackspace";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

import { PickCoinTicker } from "./PickCoinTicker";
import { AddressCoinForm } from "./AddressCoinForm";

import { SubmitFormButton } from "./../../../SubmitFormButton/SubmitFormButton";

import { useQuery } from "./../../../../hooks/useQuery";
import { useNotificationError } from "./../../../../hooks/useNotificationError";
import { fetch } from "./../../../../utils";

export function AddNewCoinForm() {
  const steps = getSteps();
  const classes = useStyles();
  const history = useHistory();
  const { walletName } = useParams();
  const match = useRouteMatch();
  const query = useQuery();

  const [activeStep, setActiveStep] = useState(0);

  const [error, setError] = useState(null);
  useNotificationError(error);

  const goBack = () => {
    const redirect = query.get("redirect");
    const { rigId } = match.params;
    redirect
      ? history.push(`/rigs/${rigId}${redirect}`)
      : history.push(`/rigs/${rigId}/wallets`);
  };

  const saveWallet = async state => {
    const { addresses, ...body } = state;
    body.address = addresses.join(".");
    const url = `coins`;
    try {
      const result = await fetch(url, { method: "POST", body });
      if (result.statusCode === 201) {
        const { rigId } = match.params;
        history.push(`/rigs/${rigId}/wallets/${walletName}`);
      }
    } catch {
      const errMsg = `Coin named: '${state.coinName}' already exist!`;
      setError(new Error(errMsg));
      return false;
    }
  };

  const handleNext = e => {
    e?.preventDefault?.();
    setActiveStep(activeStep + 1);
  };

  const handleBack = e => {
    e.preventDefault();
    setActiveStep(activeStep - 1);
  };

  const BtnType =
    activeStep === steps.length - 1 ? (
      <SubmitFormButton
        startIcon={<AddIcon />}
        type="submit"
        variant="contained"
        color="primary"
      >
        Save
      </SubmitFormButton>
    ) : (
      <SubmitFormButton
        variant="contained"
        color="primary"
        onClick={handleNext}
      >
        Next
      </SubmitFormButton>
    );

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

      <Stepper
        className={classes.Stepper}
        activeStep={activeStep}
        alternativeLabel
      >
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Form className={classes.Form} onSubmit={saveWallet}>
        <Input type="hidden" value={walletName} name="walletName" />
        <PersistStateOnUnmount>
          {activeStep === 0 && (
            <PickCoinTicker onChangeValue={handleNext} key={activeStep} />
          )}
          {activeStep === 1 && (
            <AddressCoinForm key={activeStep} walletName={walletName} />
          )}
        </PersistStateOnUnmount>
        <div className={classes.Buttons}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className={classes.backButtonForm}
          >
            Back
          </Button>
          {BtnType}
        </div>
      </Form>
    </div>
  );
}

function getSteps() {
  return ["Coin Ticker", "Coin Address"];
}

const useStyles = makeStyles(theme => ({
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
    width: "100%",
    maxWidth: "640px",
    padding: "0 16px",
    justifyContent: "space-around"
  },
  Stepper: { width: "100%", maxWidth: "640px" },
  backButton: {
    position: "absolute",
    zIndex: 2,
    top: "16px",
    left: "16px"
  },
  backButtonForm: {
    marginRight: theme.spacing(4)
  },
  Buttons: { display: "flex", justifyContent: "center" }
}));
