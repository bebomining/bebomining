import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Form, PersistStateOnUnmount } from "usetheform";

import BackIcon from "@material-ui/icons/KeyboardBackspace";
import Button from "@material-ui/core/Button";

import { StepperWorkerCreate } from "./StepperWorkerCreate/StepperWorkerCreate";
import { WorkerName } from "./WorkerName/WorkerName";
import { PoolConfig } from "./PoolConfig/PoolConfig";
import { Coins } from "./Coins/Coins";
import { Wallet } from "./Wallet/Wallet";
import { MinerPicker } from "./MinerPicker/MinerPicker";
import { GoToSummaryBtn } from "./GoToSummaryBtn/GoToSummaryBtn";

import { ActiveStepField } from "./ActiveStepField/ActiveStepField";
import { SummaryBeforeSubmit } from "./SummaryBeforeSubmit/SummaryBeforeSubmit";
import { ModePicker } from "./ModePicker/ModePicker";
import { CircularProgressCentered } from "./../../../CircularProgressCentered/CircularProgressCentered";

import { useAppContext } from "./../../../../hooks/useAppContext";
import { waitPromiseTimeout } from "./../../../../utils";
import { fetch } from "./../../../../utils";
import { useFetch } from "./../../../../hooks/useFetch";
import { useNotificationError } from "./../../../../hooks/useNotificationError";

import events from "./../../../ActionProgress/events";
const { WITH_ACTION_PROGRESS } = events;

export function FormEditWorker() {
  const history = useHistory();
  const { workerId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const { bus, apiServer } = useAppContext();

  const { data, loading, error } = useFetch(
    `${apiServer}/api/v1/workers/${workerId}`
  );
  useNotificationError(error);

  useEffect(() => {
    const moveNextStep = () => setActiveStep(prev => ++prev);
    bus.on("GO_NEXT", moveNextStep);
    return () => {
      bus.off("GO_NEXT", moveNextStep);
    };
  }, []);

  if (loading || loading === null) {
    return (
      <CircularProgressCentered
        size={60}
        label={`Loading worker info in progress...`}
      />
    );
  }

  const goToSummary = () => setActiveStep(6);
  const goBack = () => history.push(`/workers`);

  const editWorker = async state => {
    console.log("onSubmit ", state);

    const { activeStep: omitStep, poolConfig, miner, ...rest } = state;

    const {
      minerInfo: { supportGPUsRegex: omit, ...validMinerInfo },
      ...restMiner
    } = miner;
    const body = { ...rest, ...poolConfig, ...validMinerInfo, ...restMiner };

    const workerAPI = `${apiServer}/api/v1/workers/${workerId}`;
    const promise = waitPromiseTimeout(
      fetch(workerAPI, { method: "PUT", body })
    );
    bus.emit(WITH_ACTION_PROGRESS, {
      promise,
      label: `Saving changes for ${state.workerName}...`
    });
    await promise;
    setTimeout(goBack, 100);
  };

  const { results } = data;

  const initialFormState = buildFormState(results);

  return (
    <div className="FormWorker">
      <div className="FormWorker_Nav">
        <Button
          size="small"
          variant="contained"
          startIcon={<BackIcon />}
          disableElevation
          onClick={goBack}
        >
          Back
        </Button>
      </div>
      <div className="FormWorker_Wrapper">
        <Form
          initialState={initialFormState}
          reducers={mapWallet}
          onChange={state => console.log("onChange ", state)}
          onSubmit={editWorker}
        >
          <ActiveStepField activeStep={activeStep} />
          <StepperWorkerCreate
            activeStep={activeStep}
            onChangeStep={step => setActiveStep(step)}
          >
            {getStepContent(activeStep)}
          </StepperWorkerCreate>
          {activeStep != 6 && <GoToSummaryBtn goToSummary={goToSummary} />}
        </Form>

        <div id="FormWorkerPortal" />
      </div>
    </div>
  );
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return (
        <PersistStateOnUnmount key={stepIndex}>
          <WorkerName />
        </PersistStateOnUnmount>
      );
    case 1:
      return (
        <PersistStateOnUnmount key={stepIndex}>
          <ModePicker />
        </PersistStateOnUnmount>
      );
    case 2:
      return (
        <PersistStateOnUnmount key={stepIndex}>
          <PoolConfig />
        </PersistStateOnUnmount>
      );
    case 3:
      return (
        <PersistStateOnUnmount key={stepIndex}>
          <Coins />
        </PersistStateOnUnmount>
      );
    case 4:
      return <Wallet key={stepIndex} />;
    case 5:
      return (
        <PersistStateOnUnmount key={stepIndex}>
          <MinerPicker />
        </PersistStateOnUnmount>
      );
    case 6:
      return <SummaryBeforeSubmit key={stepIndex} />;
  }
}

function mapWallet(state, prevState) {
  let nexState = state;

  if (
    nexState.addNewCoinForm !== undefined &&
    nexState.addNewCoinForm.walletName
  ) {
    return { ...state, walletName: nexState.addNewCoinForm.walletName };
  }

  if (
    nexState.poolConfig?.poolName &&
    prevState.poolConfig?.poolName &&
    prevState.poolConfig?.poolName !== nexState.poolConfig?.poolName
  ) {
    const { workerName, minerMode } = nexState;
    const { poolName } = nexState.poolConfig;
    return { workerName, poolConfig: { poolName }, minerMode };
  }

  if (
    nexState.poolConfig?.algo &&
    prevState.poolConfig?.algo &&
    prevState.poolConfig?.algo !== nexState.poolConfig?.algo
  ) {
    const { workerName, minerMode } = nexState;
    const { poolName, algo } = nexState.poolConfig;
    return { workerName, poolConfig: { poolName, algo }, minerMode };
  }

  if (
    nexState.minerMode &&
    prevState.minerMode &&
    prevState.minerMode !== nexState.minerMode
  ) {
    const { workerName } = nexState;
    return { workerName, minerMode: nexState.minerMode };
  }

  if (
    nexState.coinName &&
    prevState.coinName &&
    prevState.coinName !== nexState.coinName
  ) {
    const { workerName, coinName, poolConfig, minerMode } = nexState;
    return { workerName, coinName, poolConfig, minerMode };
  }

  if (
    nexState.miner?.minerInfo &&
    prevState.miner?.minerInfo &&
    prevState.miner?.minerInfo?.minerName !==
      nexState.miner?.minerInfo?.minerName
  ) {
    const { minerInfo } = nexState.miner;
    return { ...nexState, miner: { minerInfo } };
  }

  return nexState;
}

function buildFormState(worker) {
  const {
    workerName,
    walletName,
    poolRegion,
    poolName,
    poolPort,
    minerMode,
    gpus,
    algo,
    coinName,
    minerName,
    minerTagName,
    minerAssetId,
    supportGPUsRegex
  } = worker;

  const minerInfo = { minerName, minerAssetId, minerTagName, supportGPUsRegex };
  return {
    workerName,
    walletName,
    poolConfig: { poolRegion, poolName, poolPort: String(poolPort), algo },
    minerMode,
    coinName,
    miner: { minerInfo, gpus }
  };
}
