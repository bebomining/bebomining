import React from "react";

import { makeStyles } from "@material-ui/core/styles";

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

export function NoRunningWorkers() {
  const classes = useStyles();

  return (
    <div className={classes.NoWorkers}>
      <Typography variant="h4">No running Workers!</Typography>

      <Typography className={classes.textSecondary} color="textSecondary">
        None of your workers is running at the moment!
      </Typography>
    </div>
  );
}
