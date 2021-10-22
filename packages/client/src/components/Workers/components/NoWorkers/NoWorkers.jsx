import React from "react";
import { useRouteMatch, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  NoWorkers: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    display: "flex",
    justifyContent: "center"
  },
  button: { marginTop: "32px" },
  textSecondary: { marginTop: "24px" }
});

export function NoWorkers() {
  const classes = useStyles();

  const history = useHistory();
  const match = useRouteMatch();

  const addNewWorker = () => history.push(`${match.url}/add-worker`);

  return (
    <div className={classes.NoWorkers}>
      <Typography variant="h4">No Workers!</Typography>
      <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes.button}
        startIcon={<AddIcon />}
        onClick={addNewWorker}
      >
        Add New Worker
      </Button>
      <Typography className={classes.textSecondary} color="textSecondary">
        You do not have any worker yet! Please add a worker and start mining!
      </Typography>
    </div>
  );
}
