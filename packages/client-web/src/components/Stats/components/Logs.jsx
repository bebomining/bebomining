import { useEffect, useState, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import BackIcon from "@material-ui/icons/KeyboardBackspace";
import Button from "@material-ui/core/Button";
import { useFetch } from "./../../../hooks/useFetch";

export const Logs = ({ worker, onClose }) => {
  const classes = useStyles();
  const [refreshId, setRefreshID] = useState(() => 1);

  const [logsTxt, setLogTxt] = useState(() => "");
  const logWindow = useRef();
  const dataRef = useRef();
  const timeoutId = useRef(null);

  const scrollBottom = () => {
    logWindow.current.scrollTop = logWindow.current.scrollHeight;
  };

  const { data } = useFetch(
    `workers/${worker.id}/_logs?refreshId=${refreshId}`
  );

  useEffect(() => {
    if (typeof data?.results === "string") {
      dataRef.current = data;
      if (data?.results.trim() !== "") {
        setLogTxt(data.results);
        scrollBottom();
      }
    }
  }, [data]);

  useEffect(() => {
    function fetchLogs() {
      if (typeof dataRef.current?.results === "string") {
        setRefreshID(prev => ++prev);
        timeoutId.current = setTimeout(fetchLogs, 6000);
      }
    }
    timeoutId.current = setTimeout(fetchLogs, 6000);
    () => clearTimeout(timeoutId.current);
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
    overflow: "auto",
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
