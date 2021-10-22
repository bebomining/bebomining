import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => ({
  loadingBar: {
    width: "100%",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    marginBottom: "32px"
  }
}));

export function CircularProgressCentered(props) {
  const classes = useStyles();
  return (
    <div className={classes.loadingBar}>
      {props.label && (
        <Typography
          className={classes.label}
          color="textSecondary"
          gutterBottom
        >
          {props.label}
        </Typography>
      )}
      <CircularProgress {...props} />
    </div>
  );
}
