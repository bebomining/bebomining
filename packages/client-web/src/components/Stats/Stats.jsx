import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import BackIcon from "@material-ui/icons/KeyboardBackspace";
import Button from "@material-ui/core/Button";
import LineStyleIcon from "@material-ui/icons/LineStyle";

import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useFetch } from "./../../hooks/useFetch";
import { useNotificationError } from "./../../hooks/useNotificationError";
import { Header } from "./components/Header";
import { Logs } from "./components/Logs";

import miners from "./miners";
import pools from "./pools";

export const Stats = ({ match }) => {
  const classes = useStyles();
  const history = useHistory();
  const { workerId } = useParams();
  const [showLogs, toggleLogs] = useState(() => false);
  const [refreshId, setRefersh] = useState(() => Date.now());

  const { data, loading, error } = useFetch(`workers/${workerId}`);
  useNotificationError(error);

  if (loading || loading === null) {
    return (
      <div className={classes.loadingBar}>
        <CircularProgress />
      </div>
    );
  }

  const goBack = () => {
    const { rigId } = match.params;
    history.push(`/rigs/${rigId}/workers`);
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
            className={classes.Buttons}
            size="small"
            variant="contained"
            onClick={() => setRefersh(Date.now())}
            aria-label="refresh"
            color="primary"
            startIcon={<RefreshIcon />}
          >
            <span className="btn-label">Refresh Stats</span>
          </Button>
          <Button
            className={classes.Buttons}
            size="small"
            variant="contained"
            aria-label="View Logs"
            startIcon={<LineStyleIcon />}
            color="primary"
            onClick={logsToggle}
          >
            <span className="btn-label">View Logs</span>
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
    flex: "1",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    flexShrink: "0"
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
  ActionBtn: { "& > button:first-child": { marginRight: "8px" } },
  Buttons: {
    ["@media (max-width:900px)"]: {
      "& .btn-label": { display: "none" },
      "& .MuiButton-startIcon": { margin: "0" },
      padding: "8px",
      minWidth: "initial"
    }
  }
});
