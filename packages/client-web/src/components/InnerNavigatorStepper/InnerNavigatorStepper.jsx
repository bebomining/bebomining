import React from "react";
import { useForm } from "usetheform";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

export function InnerNavigatorStepper({
  activeStep,
  children,
  evaluateNext,
  evaluatePrev,
  next,
  prev
}) {
  const classes = useStyles();
  const { state } = useForm();

  const hasNext = evaluateNext?.(state, activeStep);
  const hasPrev = evaluatePrev?.(state, activeStep);

  return (
    <div className={classes.root}>
      <div className={classes.children}>{children}</div>
      <div className={classes.buttons}>
        <Button disabled={!hasPrev} size="small" onClick={prev}>
          Prev
        </Button>
        <Button disabled={!hasNext} size="small" onClick={next} color="primary">
          Next
        </Button>
      </div>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  root: { display: "flex", flex: 1, flexDirection: "column" },
  children: { flex: 1, marginTop: "24px" },
  buttons: {
    width: "35%",
    display: "flex",
    justifyContent: "space-evenly",
    marginTop: "16px",
    marginLeft: "auto",
    marginRight: "auto"
  }
}));
