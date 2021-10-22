import { useEffect, useState } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import events from "./events";
import { useNotificationError } from "./../../hooks/useNotificationError";
import { Portal } from "./../Portal/Portal";

const { WITH_ACTION_PROGRESS } = events;

export function ActionProgress({ bus }) {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [label, setLabel] = useState(null);

  const { setError } = useNotificationError();

  useEffect(() => {
    const show = () => setShow(true);
    const hide = () => setShow(false);
    const handle = ({ promise, errorShow = true, label = "" }) => {
      label.trim().length > 0 && setLabel(label);
      show();
      promise.catch(err => errorShow && setError(err)).finally(hide);
    };

    bus.on(WITH_ACTION_PROGRESS, handle);

    return () => {
      bus.off(WITH_ACTION_PROGRESS, handle);
    };
  }, []);

  return (
    show && (
      <Portal selector="#progress-bar">
        <div className={classes.ProgressBar}>
          {label && (
            <Typography className={classes.Typography} gutterBottom>
              {label}
            </Typography>
          )}

          <LinearProgress color="secondary" />
        </div>
      </Portal>
    )
  );
}

const useStyles = makeStyles(() => ({
  ProgressBar: {
    textAlign: "left",
    textIndent: "8px",
    width: "100%"
  },
  Typography: {
    fontWeight: "bold"
  }
}));
