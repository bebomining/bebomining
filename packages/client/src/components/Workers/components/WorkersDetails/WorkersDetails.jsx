import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import { CardWorker } from "./../CardWorker/CardWorker";
import { NoWorkers } from "./../NoWorkers/NoWorkers";
import { NoRunningWorkers } from "./../NoRunningWorkers/NoRunningWorkers";

import { useAppContext } from "./../../../../hooks/useAppContext";
import { useFetch } from "./../../../../hooks/useFetch";
import { useNotificationError } from "./../../../../hooks/useNotificationError";

export function WorkersDetails() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { apiServer } = useAppContext();

  const [filters, setFilter] = useState({
    onlyRunning: false
  });

  const [disbaleAll, setDisableAll] = useState(() => false);

  const { loading, data, error, updateData, prevData } = useFetch(
    `${apiServer}/api/v1/workers?onlyRunning=${filters.onlyRunning}`
  );
  useNotificationError(error);

  if (loading || loading === null || data === null) {
    return (
      <div className={classes.loadingBar}>
        <CircularProgress size={50} />
      </div>
    );
  }

  const handleChange = event => {
    setFilter({ ...filters, [event.target.name]: event.target.checked });
  };

  const createWorker = () => {
    history.push(`${match.path}/add-worker`);
  };

  const onRemoveWorker = ({ workerId }) => {
    updateData(prev => ({
      ...prev,
      results: prev.results.filter(({ id }) => Number(id) !== Number(workerId))
    }));
  };

  const onCardAction = status => {
    setDisableAll(status);
  };

  const { results } = data;

  const hasNoRunningWorkers =
    filters.onlyRunning &&
    results?.length <= 0 &&
    prevData?.results?.length >= 0;

  const hasNoWorkers = !filters.onlyRunning && results?.length <= 0;

  if (hasNoWorkers) {
    return <NoWorkers />;
  }

  return (
    <div className={classes.Workers}>
      <div className={classes.NavBar}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={createWorker}
        >
          Add Worker
        </Button>
        {!hasNoWorkers && (
          <div>
            <FormControlLabel
              control={
                <Switch
                  disabled={disbaleAll}
                  checked={filters.onlyRunning}
                  onChange={handleChange}
                  name="onlyRunning"
                  color="secondary"
                />
              }
              label="Show only running"
            />
          </div>
        )}
      </div>
      {hasNoRunningWorkers ? (
        <NoRunningWorkers />
      ) : (
        <div id="Grid_Workers" className={classes.Grid}>
          {results.map(worker => (
            <CardWorker
              onAction={onCardAction}
              onRemoveWorker={onRemoveWorker}
              isRunning={typeof worker.pid === "number"}
              key={worker.workerName}
              {...worker}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const useStyles = makeStyles(() => ({
  Workers: {
    width: "100%",
    height: "100%",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative"
  },
  Grid: {
    overflow: "auto",
    display: "flex",
    width: "100%",
    flexWrap: "wrap",
    padding: "6px",
    "&::-webkit-scrollbar": { width: "4px" },
    "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
    "&::-webkit-scrollbar-thumb": { background: "#888" },
    "&::-webkit-scrollbar-thumb:hover": { background: "#555" }
  },
  NavBar: {
    width: "100%",
    display: "flex",
    padding: "16px 8px",
    justifyContent: "space-between"
  },
  loadingBar: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));
