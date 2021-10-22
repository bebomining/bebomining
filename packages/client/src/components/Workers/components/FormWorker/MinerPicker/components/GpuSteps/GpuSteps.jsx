import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { VersionPicker } from "./../VersionPicker/VersionPicker";
import { GPUsPicker } from "./GPUsPicker";
import { InnerNavigatorStepper } from "./../../../../../../InnerNavigatorStepper/InnerNavigatorStepper";

export function GpuSteps({ modeTarget }) {
  const steps = getSteps();
  const [activeStep, setStep] = useState(() => 0);
  const classes = useStyles();

  const next = () => setStep(prev => ++prev);
  const prev = () => setStep(prev => --prev);

  const goTo = event => {
    const elm = event.currentTarget;
    if (elm.classList.contains("MuiStep-completed")) {
      setStep(Number(elm.dataset.index));
    }
  };
  return (
    <div>
      <Stepper className={classes.Stepper} activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} data-index={index} onClick={goTo}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <InnerNavigatorStepper
        activeStep={activeStep}
        prev={prev}
        next={next}
        evaluatePrev={evaluatePrev}
        evaluateNext={evaluateNext}
      >
        {activeStep === 0 && (
          <VersionPicker key="0" onChangeValue={next} modeTarget={modeTarget} />
        )}
        {activeStep === 1 && <GPUsPicker key="1" />}
      </InnerNavigatorStepper>
    </div>
  );
}

function getSteps() {
  return ["Version", "GPUs"];
}

const useStyles = makeStyles(() => ({
  Stepper: { paddingTop: 0 }
}));

function evaluateNext(state, activeStep) {
  return activeStep === 0 && state.miner?.minerInfo;
}

function evaluatePrev(state, activeStep) {
  return activeStep > 0;
}
