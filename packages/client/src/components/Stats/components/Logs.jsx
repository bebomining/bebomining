import { useEffect, useState, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import BackIcon from "@material-ui/icons/KeyboardBackspace";
import Button from "@material-ui/core/Button";

export const Logs = ({ worker, onClose }) => {
  const classes = useStyles();
  const [logsTxt, setLogTxt] = useState(() => "");
  const { workerName } = worker;
  const logWindow = useRef();
  const scrollBottom = () => {
    logWindow.current.scrollTop = logWindow.current.scrollHeight;
  };

  useEffect(() => {
    const updateLog = function (newLogLine) {
      setLogTxt(`<p>${newLogLine}</p>`);
      scrollBottom();
    };
    const removeListener = window.electron.on(`log_${workerName}`, updateLog);
    return () => {
      removeListener();
    };
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.NavBar}>
        <Button
          size="small"
          variant="contained"
          startIcon={<BackIcon />}
          disableElevation
          onClick={onClose}
        >
          Back
        </Button>
      </div>
      <div className={classes.LogsWrapper}>
        <div
          ref={logWindow}
          className={classes.Wrapper}
          dangerouslySetInnerHTML={{ __html: logsTxt || "Loading logs..." }}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    flexDirection: "column"
  },
  NavBar: { width: "100%", display: "flex", padding: "16px 8px" },
  LogsWrapper: {
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    padding: "0 8px 8px 8px",
    flex: 1
  },
  Wrapper: {
    fontFamily: "monospace",
    width: "100%",
    height: "100%",
    borderRadius: "5px",
    padding: "16px",
    backgroundColor: "black",
    color: "white",
    overflow: "auto",
    "& p": { padding: 0, margin: 0 },
    "&::-webkit-scrollbar": { width: "5px" },
    "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
    "&::-webkit-scrollbar-thumb": { background: "#888" },
    "&::-webkit-scrollbar-thumb:hover": { background: "#555" }
  }
});
