import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import BackIcon from "@material-ui/icons/KeyboardBackspace";
import Button from "@material-ui/core/Button";
import LineStyleIcon from "@material-ui/icons/LineStyle";

import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useFetch } from "./../../hooks/useFetch";
import { useAppContext } from "./../../hooks/useAppContext";
import { useNotificationError } from "./../../hooks/useNotificationError";
import { Header } from "./components/Header";
import { Logs } from "./components/Logs";

import miners from "./miners";
import pools from "./pools";

export const Stats = () => {
  const classes = useStyles();
  const history = useHistory();
  const { workerId } = useParams();
  const [showLogs, toggleLogs] = useState(() => false);
  const [refreshId, setRefersh] = useState(() => Date.now());

  const { apiServer } = useAppContext();
  const { data, loading, error } = useFetch(
    `${apiServer}/api/v1/workers/${workerId}`
  );
  useNotificationError(error);

  if (loading || loading === null) {
    return (
      <div className={classes.loadingBar}>
        <CircularProgress />
      </div>
    );
  }

  const goBack = () => {
    history.push(`/workers`);
  };

  const logsToggle = () => toggleLogs(prev => !prev);

  const worker = data.results;
  const meta = data.meta;

  const { minerName, poolName } = worker;
  const Miner = miners[minerName.toLowerCase()];
  const Pool = pools[poolName.toLowerCase()];

  return (
    <div className={classes.root}>
      <div className={classes.Nav}>
        <Button
          size="small"
          variant="contained"
          startIcon={<BackIcon />}
          disableElevation
          onClick={goBack}
        >
          Back
        </Button>
        <div className={classes.ActionBtn}>
          <Button
            size="small"
            variant="contained"
            onClick={() => setRefersh(Date.now())}
            aria-label="refresh"
            color="primary"
            startIcon={<RefreshIcon />}
          >
            Refresh Stats
          </Button>
          <Button
            size="small"
            variant="contained"
            aria-label="View Logs"
            startIcon={<LineStyleIcon />}
            color="primary"
            onClick={logsToggle}
          >
            View Logs
          </Button>
        </div>
      </div>
      <div className={classes.WrapperScrollable}>
        <Header worker={worker} meta={meta} />
        <Pool worker={worker} meta={meta} refreshId={refreshId} />
        <Miner worker={worker} meta={meta} refreshId={refreshId} />
      </div>
      {showLogs && <Logs worker={worker} onClose={logsToggle} />}
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  WrapperScrollable: {
    width: "100%",
    height: "100%",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    "&::-webkit-scrollbar": { width: "5px" },
    "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
    "&::-webkit-scrollbar-thumb": { background: "#888" },
    "&::-webkit-scrollbar-thumb:hover": { background: "#555" }
  },
  Nav: {
    padding: "16px",
    display: "flex",
    width: "100%",
    justifyContent: "space-between"
  },
  loadingBar: {
    width: "100%",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  ActionBtn: { "& > button:first-child": { marginRight: "8px" } }
});
