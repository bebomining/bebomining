import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Input } from "usetheform";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { SubmitFormButton } from "./../../../SubmitFormButton/SubmitFormButton";
import { Notification } from "./../../../Notification/Notification";

import { fetch, waitPromiseTimeout } from "./../../../../utils";

import { useAppContext } from "./../../../../hooks/useAppContext";
import { useNotification } from "./../../../../hooks/useNotification";

import events from "./../../../ActionProgress/events";
const { WITH_ACTION_PROGRESS } = events;

export function RestoreFromBackup({ onCancel }) {
  const classes = useStyles();
  const { apiServer, bus } = useAppContext();
  const addNotification = useNotification();

  const [disabledBtn, setDisableBtn] = useState(() => false);

  const onCancelOperation = () => {
    if (!disabledBtn) {
      onCancel();
    }
  };

  const restoreBackup = async ({ backup }) => {
    setDisableBtn(true);
    try {
      const body = new FormData();
      body.append("backup", backup, backup.name);

      const promise = waitPromiseTimeout(
        fetch(`${apiServer}/api/v1/data/_backup`, {
          method: "POST",
          body
        }).then(res => res.json()),
        3000
      );
      const label = `Restoring backup in progress...`;
      bus.emit(WITH_ACTION_PROGRESS, { promise, label });
      promise.then(data => {
        if (data?.statusCode === 201) {
          addNotification(
            <Notification severity="success">
              Backup restored with success!
            </Notification>
          );
          window.electron.send("reloadPage");
          onCancel();
        } else {
          setDisableBtn(false);
        }
      });

      return Promise.resolve();
    } catch {
      setDisableBtn(false);
      addNotification(
        <Notification severity="error">
          An error occurred, retry again!
        </Notification>
      );
      return Promise.reject();
    }
  };

  const [open, setOpen] = useState(() => false);

  useEffect(() => {
    fetch(`${apiServer}/api/v1/workers?onlyRunning=true`)
      .then(res => res.json())
      .then(res => {
        const { results, statusCode } = res;
        if (statusCode === 200 && results?.length === 0) {
          setOpen(true);
        } else {
          addNotification(
            <Notification severity="error">
              Please stop running workers before restoring a backup!
            </Notification>
          );
          onCancel();
        }
      })
      .catch(() => {
        addNotification(
          <Notification severity="error">
            Backup restore not available! Please restart the app!
          </Notification>
        );
        onCancel();
      });
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onCancelOperation}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Form encType="multipart/form-data" onSubmit={restoreBackup}>
        <DialogTitle id="alert-dialog-title">Upload a backup</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            By restoring your Backup, please, mind that you will lose the
            current data such as workers, wallets and coins
          </DialogContentText>
          <div className={classes.File}>
            <Input
              disabled={disabledBtn}
              type="file"
              validators={[required]}
              name="backup"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button disabled={disabledBtn} onClick={onCancelOperation}>
            Close
          </Button>
          <SubmitFormButton variant="contained" color="primary">
            Confirm Restore
          </SubmitFormButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

const required = value => {
  return value && value instanceof File ? undefined : "Required";
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.palette.background.paper
  },
  File: {
    padding: "14px 0",
    display: "flex",
    justifyContent: "center"
  }
}));
