import React, { useEffect, useState, useRef, useCallback } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import DeleteIcon from "@material-ui/icons/DeleteOutlineTwoTone";
import StatsIcon from "@material-ui/icons/EqualizerOutlined";
import Button from "@material-ui/core/Button";

import EditIcon from "@material-ui/icons/Edit";
import Typography from "@material-ui/core/Typography";
import WalletIcon from "@material-ui/icons/AccountBalanceWalletTwoTone";
import { PlayButton } from "./components/PlayButton";
import { fetch, waitPromiseTimeout } from "./../../../../utils";
import { useAppContext } from "./../../../../hooks/useAppContext";
import { ConfirmModal } from "./../../../ConfirmModal/ConfirmModal";
import { formatNumber } from "./../../../../utils";

import events from "./../../../ActionProgress/events";
const { WITH_ACTION_PROGRESS } = events;

import {
  ON_PLAY_WORKER_START,
  ON_PLAY_WORKER_END_SUCCESS,
  ON_PLAY_WORKER_END_ERROR,
  ON_STOP_WORKER_START,
  ON_STOP_WORKER_END_SUCCESS,
  ON_STOP_WORKER_END_ERROR
} from "./../../events";

const noop = () => null;
export function CardWorker({
  workerName,
  coinName,
  minerMode,
  minerName,
  poolName,
  walletName,
  algo,
  id: workerId,
  onAction = noop,
  isRunning = false,
  onRemoveWorker
}) {
  const classes = useStyles();
  const { bus } = useAppContext();
  const history = useHistory();
  const match = useRouteMatch();

  const [status, setStatus] = useState(() => isRunning);
  const [disableAllAction, setDisableAllAction] = useState(() => false);
  const [showRemoveModal, setShowRemoveModal] = useState(() => false);

  const openStats = () => {
    const { rigId } = match.params;
    status && history.push(`/rigs/${rigId}/workers/stats/${workerId}`);
  };

  const onEdit = () => {
    const { rigId } = match.params;
    history.push(`/rigs/${rigId}/workers/edit/${workerId}`);
  };

  const onPlay = async () => {
    setDisableAllAction(true);
    onAction(true);
    try {
      bus.emit(ON_PLAY_WORKER_START);
      const url = `workers/${workerId}/_start`;
      const promise = waitPromiseTimeout(fetch(url, { method: "POST" }));
      const label = `Starting ${workerName}...`;
      bus.emit(WITH_ACTION_PROGRESS, { promise, label });
      const result = await promise;
      setStatus(true);
      getCardStats();
      bus.emit(ON_PLAY_WORKER_END_SUCCESS);
      console.log("onPlay ", result);
    } catch {
      bus.emit(ON_PLAY_WORKER_END_ERROR);
    } finally {
      setDisableAllAction(false);
      onAction(false);
    }
  };

  const onStop = async () => {
    setStatus(false);
    setDisableAllAction(true);
    onAction(true);
    try {
      bus.emit(ON_STOP_WORKER_START);
      const url = `workers/${workerId}/_stop`;
      const promise = waitPromiseTimeout(fetch(url, { method: "POST" }));
      const label = `Stopping ${workerName}...`;
      bus.emit(WITH_ACTION_PROGRESS, { promise, label });
      await promise;
      setStatus(false);
      setStats(null);
      bus.emit(ON_STOP_WORKER_END_SUCCESS);
      clearTimeout(pingFn.current);
    } catch {
      bus.emit(ON_STOP_WORKER_END_ERROR);
    } finally {
      setDisableAllAction(false);
      onAction(false);
    }
  };

  const toggleRemoveModal = () => setShowRemoveModal(prev => !prev);

  const onConfirm = async () => {
    setDisableAllAction(true);
    toggleRemoveModal();
    try {
      const url = `workers/${workerId}`;
      const promise = waitPromiseTimeout(fetch(url, { method: "DELETE" }));
      const label = `Deleting Worker: '${workerName}'...`;
      bus.emit(WITH_ACTION_PROGRESS, { promise, label });
      await promise;
      onRemoveWorker({ workerId });
    } catch (err) {
      console.error(err);
    } finally {
      setDisableAllAction(false);
    }
  };

  const pingFn = useRef(null);
  const [stats, setStats] = useState(() => null);
  const playBtnRef = useRef();
  const isMounted = useRef(false);

  const intervalRefStatus = useRef({ status });
  intervalRefStatus.current.status = status;

  const getCardStats = useCallback(async function getCardStats() {
    const urlStats = `workers/${workerId}/_stats`;
    try {
      const stats = await fetch(urlStats);
      if (isMounted.current && intervalRefStatus.current.status) {
        setStats(stats.results);
        pingFn.current = setTimeout(getCardStats, 5000);
      }
    } catch {
      if (isMounted.current) {
        setStatus(false);
        setStats(null);
        playBtnRef.current.forceShowPlayBtn();
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    status && getCardStats();
    return () => {
      isMounted.current = false;
      clearTimeout(pingFn.current);
    };
  }, []);

  const workerNameFormat =
    workerName.length >= 30 ? `${workerName.substring(0, 30)}...` : workerName;
  const title = status ? `Check ${workerNameFormat} Stats` : undefined;

  const colorStatIcon = status ? "primary" : "inherit";

  const { performance, performanceUnit } = stats?.session || {};

  return (
    <div data-id={workerId} className={classes.CardWrapper}>
      <Card
        title={title}
        className={classes.root}
        variant="outlined"
        data-running={status}
      >
        {performance !== undefined && (
          <div className={classes.Performance}>
            {formatNumber(performance)} {performanceUnit}
          </div>
        )}
        <CardContent>
          <Typography
            title={`Name: ${workerName}`}
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            <span className={classes.WrapperStatsIcon}>
              <span style={{ maxWidth: "180px" }} className="text-ellipsis">
                {workerName}
              </span>
              <StatsIcon color={colorStatIcon} />
            </span>
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            className={classes.textPrimary}
          >
            COIN: {coinName}
          </Typography>
          <Typography className={classes.textSecondary} color="textSecondary">
            <span className="text-ellipsis">
              {poolName} - {algo} - {minerName} - {minerMode}
            </span>
          </Typography>
          <Typography
            variant="body2"
            component="p"
            className={classes.WalletInfo}
          >
            <WalletIcon />
            <span
              title={`Wallet Name: ${walletName}`}
              className="text-ellipsis"
            >
              {walletName}
            </span>
          </Typography>
        </CardContent>
        <CardActions className={classes.CardActions}>
          <Button
            className={classes.buttons}
            size="small"
            disabled={disableAllAction || status}
            aria-label="remove"
            title="remove"
            onClick={toggleRemoveModal}
            startIcon={<DeleteIcon />}
          >
            Remove
          </Button>
          <Button
            className={classes.buttons}
            size="small"
            disabled={disableAllAction || status}
            aria-label="edit"
            title="edit"
            onClick={onEdit}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <PlayButton
            innerRef={playBtnRef}
            className={classes.buttons}
            forceDisabled={disableAllAction}
            initialStatus={!status}
            onStop={onStop}
            onPlay={onPlay}
          />
        </CardActions>
        <div className={classes.buttonCover} onClick={openStats} />
      </Card>
      {showRemoveModal && (
        <ConfirmModal
          content={`You will be removing the worker: '${workerName}'!`}
          onCancel={toggleRemoveModal}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    position: "relative",
    width: "100%",
    textAlign: "left",
    "&:hover[data-running='true'], &:focus[data-running='true']": {
      cursor: "pointer",
      boxShadow: "0px 10px 13px -7px #e0e0e0",
      border: "1px solid #3f51b5"
    }
  },
  Performance: {
    backgroundColor: "#439c43",
    padding: "2px 4px",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    borderBottomRightRadius: "4px",
    borderBottomLeftRadius: "4px",
    fontSize: "12px",
    color: "white",
    fontWeight: "bolder"
  },
  WrapperStatsIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  buttonCover: {
    width: "100%",
    position: "absolute",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 1
  },
  buttons: { zIndex: 2, position: "relative" },
  title: { fontSize: 14 },
  textSecondary: { marginBottom: 12, textTransform: "lowercase" },
  textPrimary: { textTransform: "uppercase" },
  CardWrapper: {
    width: "33.33%",
    padding: "4px",
    ["@media (max-width:900px)"]: {
      width: "50%"
    },
    ["@media (max-width:624px)"]: {
      width: "100%"
    }
  },
  WalletInfo: {
    display: "flex",
    alignItems: "center",
    "& span": { marginLeft: "4px" }
  },
  CardActions: { justifyContent: "space-between" }
});
