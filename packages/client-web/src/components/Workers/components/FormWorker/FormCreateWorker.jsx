import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, PersistStateOnUnmount } from "usetheform";

import BackIcon from "@material-ui/icons/KeyboardBackspace";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { StepperWorkerCreate } from "./StepperWorkerCreate/StepperWorkerCreate";
import { WorkerName } from "./WorkerName/WorkerName";
import { PoolConfig } from "./PoolConfig/PoolConfig";
import { Coins } from "./Coins/Coins";
import { Wallet } from "./Wallet/Wallet";
import { MinerPicker } from "./MinerPicker/MinerPicker";
import { ActiveStepField } from "./ActiveStepField/ActiveStepField";
import { SummaryBeforeSubmit } from "./SummaryBeforeSubmit/SummaryBeforeSubmit";
import { ModePicker } from "./ModePicker/ModePicker";

import { useAppContext } from "./../../../../hooks/useAppContext";
import { useFetch } from "./../../../../hooks/useFetch";

import { waitPromiseTimeout } from "./../../../../utils";
import { fetch } from "./../../../../utils";

import events from "./../../../ActionProgress/events";
const { WITH_ACTION_PROGRESS } = events;

export function FormCreateWorker({ match }) {
  const classes = useStyles();
  const { rigId } = match.params;

  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);
  const { bus } = useAppContext();

  const { loading: loadingMiner, error: minerError } =
    useFetch(`miners/_installed`);

  const { loading: loadingWallet, error: walletsError } = useFetch(`wallets`);

  useEffect(() => {
    const moveNextStep = () => setActiveStep(prev => ++prev);
    bus.on("GO_NEXT", moveNextStep);
    return () => {
      bus.off("GO_NEXT", moveNextStep);
    };
  }, []);

  if (
    loadingWallet ||
    loadingWallet === null ||
    loadingMiner ||
    loadingMiner === null
  ) {
    return (
      <div className={classes.loadingBar}>
        <CircularProgress />
      </div>
    );
  }

  if (minerError?.statusCode === 404) {
    return (
      <div className={classes.ErrorWrapper}>
        <Typography variant="h4">{minerError.message}</Typography>
        <Button
          size="large"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          disableElevation
          onClick={() => history.push(`/miners`)}
        >
          Install Miners
        </Button>
        <Typography className={classes.textSecondary} color="textSecondary">
          Please install a miner software!
        </Typography>
      </div>
    );
  }

  if (walletsError?.statusCode === 404) {
    return (
      <div className={classes.ErrorWrapper}>
        <Typography variant="h4">{walletsError.message}</Typography>
        <Button
          size="large"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          disableElevation
          onClick={() => history.push(`/wallets/add-wallet`)}
        >
          Add New Wallet
        </Button>
        <Typography className={classes.textSecondary} color="textSecondary">
          You do not have any wallet yet! Please add a wallet!
        </Typography>
      </div>
    );
  }

  const goBack = () => {
    history.push(`/rigs/${rigId}/workers`);
  };

  const saveWorker = async state => {
    console.log("onSubmit ", state);
    const { activeStep: omitStep, poolConfig, miner, ...rest } = state;
    const {
      minerInfo: { supportGPUsRegex: omit, ...validMinerInfo },
      ...restMiner
    } = miner;
    const body = { ...rest, ...poolConfig, ...validMinerInfo, ...restMiner };
    const workerAPI = `workers`;
    const promise = waitPromiseTimeout(
      fetch(workerAPI, { method: "POST", body })
    );
    bus.emit(WITH_ACTION_PROGRESS, {
      promise,
      label: `Creating ${state.workerName}...`
    });
    await promise;
    setTimeout(goBack, 100);
  };

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
        <Form reducers={mapWallet} onSubmit={saveWorker}>
          <ActiveStepField activeStep={activeStep} />
          <StepperWorkerCreate
            activeStep={activeStep}
            onChangeStep={step => setActiveStep(step)}
          >
            {getStepContent(activeStep)}
          </StepperWorkerCreate>
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
        <PersistStateOnUnmount>
          <WorkerName key={stepIndex} />
        </PersistStateOnUnmount>
      );
    case 1:
      return (
        <PersistStateOnUnmount>
          <ModePicker key={stepIndex} />
        </PersistStateOnUnmount>
      );
    case 2:
      return (
        <PersistStateOnUnmount>
          <PoolConfig key={stepIndex} />
        </PersistStateOnUnmount>
      );
    case 3:
      return (
        <PersistStateOnUnmount>
          <Coins key={stepIndex} />
        </PersistStateOnUnmount>
      );
    case 4:
      return <Wallet key={stepIndex} />;
    case 5:
      return (
        <PersistStateOnUnmount>
          <MinerPicker key={stepIndex} />
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

const useStyles = makeStyles(() => ({
  ErrorWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    "& > button": { marginTop: "24px" }
  },
  loadingBar: {
    width: "100%",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  textSecondary: {
    marginTop: "24px"
  }
}));
