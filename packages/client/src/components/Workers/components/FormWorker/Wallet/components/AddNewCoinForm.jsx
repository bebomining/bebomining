import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Collection, useForm, PersistStateOnUnmount } from "usetheform";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";

import { PickWallet } from "./PickWallet";
import { AddressCoinForm } from "./AddressCoinForm";

import { SubmitFormButton } from "../../../../../SubmitFormButton/SubmitFormButton";
import { Portal } from "../../../../../Portal/Portal";
import { useAppContext } from "../../../../../../hooks/useAppContext";
import { useNotificationError } from "./../../../../../../hooks/useNotificationError";

import { fetch } from "../../../../../../utils";

export function AddNewCoinForm({ coinName, toggleWalletForm }) {
  const steps = getSteps();
  const classes = useStyles();
  const { bus, apiServer } = useAppContext();
  const [activeStep, setActiveStep] = useState(0);

  const { setError } = useNotificationError();

  const { state } = useForm();

  const handleNext = e => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const addCoin = async e => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    try {
      const newState = { ...state.addNewCoinForm, coinName };
      const { addresses, ...body } = newState;
      body.address = addresses.join(".");
      await fetch(`${apiServer}/api/v1/coins`, { method: "POST", body });
      toggleWalletForm();
      bus.emit("GO_NEXT");
    } catch (err) {
      console.log(err);
      const errMsg = `Error saving ${coinName} address!`;
      setError(new Error(errMsg));
      return false;
    }
  };

  const handleBack = e => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (activeStep >= 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const showSubmit = activeStep >= steps.length - 1;
  const onClick = showSubmit ? addCoin : handleNext;
  const startIcon = showSubmit && <AddIcon />;

  return (
    <Portal selector="#FormWorkerPortal">
      <div className={classes.FormWrapper}>
        <Typography variant="h4">
          Add <b>{coinName}</b> into an existing wallet...
        </Typography>
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

        <div className={classes.Form}>
          <Collection object name="addNewCoinForm">
            <PersistStateOnUnmount>
              {activeStep === 0 && (
                <PickWallet onChangeValue={handleNext} key={activeStep} />
              )}
              {activeStep === 1 && (
                <AddressCoinForm key={activeStep} coinName={coinName} />
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
              <SubmitFormButton
                variant="contained"
                color="primary"
                onClick={onClick}
                startIcon={startIcon}
              >
                {showSubmit ? `Add` : "Next"}
              </SubmitFormButton>
            </div>
          </Collection>
        </div>
      </div>
    </Portal>
  );
}

function getSteps() {
  return ["Pick a Wallet", "Coin Address"];
}

const useStyles = makeStyles(theme => ({
  FormWrapper: {
    width: "100%",
    height: "100%",
    top: "0",
    left: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "absolute",
    background: "white",
    zIndex: 2
  },
  Form: {
    display: "flex",
    flexDirection: "column",
    height: "33%",
    width: "100%",
    maxWidth: "50%",
    justifyContent: "space-around"
  },
  Stepper: { width: "100%", maxWidth: "45%" },
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
