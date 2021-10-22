import { useRef } from "react";
import { Form } from "usetheform";
import { makeStyles } from "@material-ui/core/styles";
import { RefreshIdBtn } from "./RefreshIdBtn";
import { SwitchBtn } from "./SwitchBtn";

import { useAppContext } from "./../../../hooks/useAppContext";
import { TextField } from "../../TextField/TextField";

export function CloudConnector({
  settings,
  onOpenConnection,
  onCloseConnection,
  onReady,
  onRefreshID
}) {
  const classes = useStyles();

  const { enabled, rigID = "" } = settings;

  const prevState = useRef({});
  const { socket } = useAppContext();

  const onChange = state => {
    if (prevState.current.cloudEnabled && !state.cloudEnabled) {
      socket.close();
      onCloseConnection?.();
      console.log("CLOSE CONNECTION");
    } else if (
      !prevState.current.cloudEnabled &&
      state.cloudEnabled &&
      !socket.isConnected()
    ) {
      console.log("OPEN CONNECTION");
      socket.connect(state.uuid);
      onOpenConnection?.(state.uuid);
    } else if (prevState.current.uuid !== state.uuid) {
      socket.close();
      onRefreshID?.(state.uuid);
      onCloseConnection?.();

      if (state.cloudEnabled && !socket.isConnected()) {
        console.log("REFRESH CONNECTION");
        socket.connect(state.uuid);
        onOpenConnection?.(state.uuid);
      }
    }
    prevState.current = state;
  };

  const onInit = state => {
    if (
      state.cloudEnabled &&
      state?.uuid?.trim?.() !== "" &&
      !socket.isConnected()
    ) {
      socket.connect(state.uuid);
      onOpenConnection?.(state.uuid);
      prevState.current = state;
    }
    onReady?.(state);
  };

  return (
    <div className={classes.root}>
      <Form onChange={onChange} onInit={onInit}>
        <div className={classes.CloudConnector}>
          <div className={classes.Input}>
            <TextField
              className={classes.TextField}
              type="text"
              initValue={rigID}
              label="Your Rig Id"
              name="uuid"
              inputProps={{ readOnly: true, disabled: rigID === null }}
            />
            <RefreshIdBtn />
          </div>
          <SwitchBtn
            initValue={enabled}
            name="cloudEnabled"
            label="Remote Control"
          />
        </div>
      </Form>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    width: "100%"
  },
  CloudConnector: {
    width: "100%",
    display: "flex",
    height: "100%",
    flexDirection: "column"
  },
  Input: {
    display: "flex",
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "8px"
  },
  RefreshId: {
    marginLeft: "32px",
    flexShrink: "0"
  }
}));
