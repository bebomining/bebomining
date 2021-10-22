import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { NamePicker } from "./NamePicker";
import { RegionPicker } from "./RegionPicker";
import { AlgorithmPicker } from "./AlgorithmPicker";
import { PortServerPicker } from "./PortServerPicker";
import { Collection, PersistStateOnUnmount } from "usetheform";
import { InnerNavigatorStepper } from "./../../../../InnerNavigatorStepper/InnerNavigatorStepper";

export function PoolConfig() {
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
      <div style={{ maxWidth: "624px", padding: "0 24px", margin: "auto" }}>
        <Stepper className={classes.Stepper} activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} data-index={index} onClick={goTo}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      <InnerNavigatorStepper
        activeStep={activeStep}
        prev={prev}
        next={next}
        evaluatePrev={evaluatePrev}
        evaluateNext={evaluateNext}
      >
        <Collection object name="poolConfig" validators={[isValid]}>
          <PersistStateOnUnmount>
            <div
              style={{ maxWidth: "624px", padding: "0 24px", margin: "auto" }}
            >
              {activeStep === 0 && <NamePicker onChangeValue={next} key="0" />}
              {activeStep === 1 && (
                <AlgorithmPicker onChangeValue={next} key="1" />
              )}
              {activeStep === 2 && (
                <RegionPicker onChangeValue={next} key="2" />
              )}
              {activeStep === 3 && <PortServerPicker key="3" />}
            </div>
          </PersistStateOnUnmount>
        </Collection>
      </InnerNavigatorStepper>
    </div>
  );
}

function getSteps() {
  return ["Name", "Algorithm", "Region", "Port"];
}

const useStyles = makeStyles(() => ({
  Stepper: { paddingTop: 0, overflow: "auto" }
}));

function evaluateNext(state, activeStep) {
  return (
    (activeStep === 0 && state.poolConfig?.poolName) ||
    (activeStep === 1 &&
      state.poolConfig?.poolName &&
      state.poolConfig?.algo) ||
    (activeStep === 2 &&
      state.poolConfig?.poolName &&
      state.poolConfig?.algo &&
      state.poolConfig?.poolRegion)
  );
}

function evaluatePrev(state, activeStep) {
  return activeStep > 0;
}

function isValid(pool) {
  return pool?.poolName && pool?.poolPort && pool?.poolRegion
    ? undefined
    : "error";
}
