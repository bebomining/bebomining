import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { SubmitFormButton } from "./../../../../SubmitFormButton/SubmitFormButton";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  wrapper: { flex: 1 },
  wrapperContent: {
    width: "100%",
    height: "100%",
    justifyContent: "space-evenly",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%"
  },
  backButton: {
    marginRight: theme.spacing(4)
  },
  instructions: {
    padding: "0 16px",
    textAlign: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  Stepper: {
    overflow: "auto"
  }
}));

export function StepperWorkerCreate({ onChangeStep, activeStep, children }) {
  const classes = useStyles();
  const steps = getSteps();

  const handleNext = e => {
    e.preventDefault();
    onChangeStep(activeStep + 1);
  };

  const handleBack = e => {
    e.preventDefault();
    onChangeStep(activeStep - 1);
  };

  const BtnType =
    activeStep === steps.length - 1 ? (
      <SubmitFormButton type="submit" variant="contained" color="primary">
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
    <div className={classes.root}>
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
      <div className={classes.wrapper}>
        <div className={classes.wrapperContent}>
          <Typography variant="h4" className={classes.instructions}>
            {getStepContent(activeStep)}
          </Typography>
          <div className={classes.form}>{children}</div>
          <div>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.backButton}
            >
              Back
            </Button>
            {BtnType}
          </div>
        </div>
      </div>
    </div>
  );
}

function getSteps() {
  return [
    "Worker Name",
    "Mining Mode",
    "Config Pool",
    "COIN",
    "Wallet",
    "Config Miner",
    "Summary"
  ];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return "Type the worker name";
    case 1:
      return "Mining mode: GPU or CPU?";
    case 2:
      return "Configure the pool you want to use";
    case 3:
      return "Select the coin you want to mine";
    case 4:
      return "Select the wallet you want to use";
    case 5:
      return "Config the miner software you want to use";
    case 6:
      return "Worker Settings";
    default:
      return "Unknown stepIndex";
  }
}
