import React, { useState, memo, useEffect } from "react";
import mitt from "mitt";

import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { useSocketAndWebRTC } from "./hooks/useSocketAndWebRTC";
import { NotificationContext } from "./contexts";
import { AppWrapper } from "./AppWrapper";
import { NotificationsPortal } from "./components/NotificationsPortal/NotificationsPortal";
import { ActionProgress } from "./components/ActionProgress/ActionProgress";
import { Disclaimer } from "./components/Disclaimer/Disclaimer";
import {
  ON_DISCLAIMER_ACCEPTED,
  ON_DISCLAIMER_REJECTED
} from "./components/Disclaimer/events";

import { GAevents } from "./components/GAevents/GAevents";

import "./styles.css";

const bus = mitt();
const apiServer = process.env.REACT_APP_API_SERVER;

function App() {
  const [disclaimerRejection, setDisclaimerRejection] = useState(() => false);

  const classes = useStyles();
  const socket = useSocketAndWebRTC({ bus });
  const [value, setValueApp] = useState(() => ({
    bus,
    socket,
    apiServer,
    isAppLoaded: false,
    userSettings: null,
    winStatus: "restore"
  }));
  const [notification, setNotification] = useState(() => ({ list: [] }));

  useEffect(() => {
    const updateLog = function (winStatus) {
      setValueApp(prev => ({ ...prev, winStatus }));
    };
    const removeListener = window.electron.on("onWinStatusChange", updateLog);

    const onUserSettings = function (userSettings) {
      console.log("userSettings => ", userSettings);
      setValueApp(prev => ({ ...prev, userSettings, isAppLoaded: true }));
    };

    const removeOnUserSettings = window.electron.on(
      "onUserSettings",
      onUserSettings
    );

    return () => {
      removeListener();
      removeOnUserSettings();
    };
  }, []);

  useEffect(() => {
    if (value.isAppLoaded) {
      const { enabled, rigID } = value.userSettings.cloudSettings;
      if (enabled && rigID?.trim?.() !== "" && !socket.isConnected()) {
        socket.connect(rigID);
      }
    }
  }, [value.isAppLoaded]);

  const onAcceptDisclaimer = () => {
    bus.emit(ON_DISCLAIMER_ACCEPTED);
    window.electron.send("onDisclaimerAccepted");
    setValueApp(prev => ({
      ...prev,
      userSettings: { ...prev.userSettings, disclaimerAccepted: true }
    }));
  };

  const onRejectDisclaimer = () => {
    if (!disclaimerRejection) {
      bus.emit(ON_DISCLAIMER_REJECTED);
      setDisclaimerRejection(true);
      setTimeout(() => window.electron.send("onDisclaimerRejected"), 5000);
    }
  };

  if (disclaimerRejection) {
    return (
      <div className={classes.ProgressBar}>
        <Typography
          variant="h5"
          component="h5"
          color="textSecondary"
          className={classes.ProgressBarTitle}
          gutterBottom
        >
          Application is shutting down! You rejected terms and conditions!
        </Typography>
        <LinearProgress color="primary" />
      </div>
    );
  }

  if (!value.isAppLoaded) {
    return (
      <div className={classes.ProgressBar}>
        <Typography
          variant="h5"
          component="h5"
          color="textSecondary"
          className={classes.ProgressBarTitle}
          gutterBottom
        >
          Loading settings...
        </Typography>
        <LinearProgress color="primary" />
      </div>
    );
  }

  const { disclaimerAccepted = false } = value.userSettings;

  return (
    <div className="App">
      {!disclaimerAccepted && (
        <Disclaimer
          onReject={onRejectDisclaimer}
          onAccept={onAcceptDisclaimer}
        />
      )}
      <NotificationContext.Provider value={setNotification}>
        <AppWrapper value={value} />
        <NotificationsPortal selector="#notifications">
          {notification.list.map((elm, index) => {
            const identifier = `${Date.now()}${index}`;
            return <React.Fragment key={identifier}>{elm}</React.Fragment>;
          })}
        </NotificationsPortal>
        <ActionProgress bus={bus} />
      </NotificationContext.Provider>
      <GAevents bus={bus} />
    </div>
  );
}

export default memo(App);

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
