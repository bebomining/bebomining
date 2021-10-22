import { useEffect, useState, PureComponent } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  matchPath
} from "react-router-dom";
import mitt from "mitt";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import { RigControl } from "./components/RigControl/RigControl";
import { useSocketAndWebRTC } from "./hooks/useSocketAndWebRTC";
import { AppContext } from "./contexts";
import { ActionProgress } from "./components/ActionProgress/ActionProgress";

import "./styles.css";

const bus = mitt();
window._BUS = bus;

export function AppCore() {
  const classes = useStyles();
  const [rigId, setRigId] = useState(() => null);
  const [connecting, setConnecting] = useState(() => true);
  const [value, setState] = useState(() => ({ bus }));

  const onReady = send => {
    setState(prev => ({ ...prev, socket: { send } }));
    setConnecting(false);
  };

  useSocketAndWebRTC({ roomId: rigId, bus }, onReady);

  useEffect(() => {
    const match = matchPath(window.location.hash, {
      path: "#/rigs/:rigId",
      exact: false,
      strict: false
    });
    const { rigId } = match?.params || {};
    if (rigId && rigId.trim() !== "") {
      setRigId(rigId);
    }
  }, []);

  if (connecting) {
    return (
      <div className={classes.ProgressBar}>
        <Typography
          variant="h5"
          component="h5"
          color="textSecondary"
          className={classes.ProgressBarTitle}
          gutterBottom
        >
          Connecting...
        </Typography>
        <LinearProgress color="primary" />
      </div>
    );
  }
  return (
    <AppContext.Provider value={value}>
      <Router>
        <Switch>
          <Route path="/rigs/:rigId" component={RigControl} />
        </Switch>
      </Router>
      <ActionProgress bus={bus} />
    </AppContext.Provider>
  );
}

const useStyles = makeStyles(() => ({
  ProgressBar: {
    height: "auto",
    width: "80%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  ProgressBarTitle: { marginBottom: "24px" }
}));

export default class AppWrapper extends PureComponent {
  render() {
    return <AppCore />;
  }
}
