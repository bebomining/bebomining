import React, { useEffect, useState } from "react";
import { useAppContext } from "./useAppContext";
import { useNotification } from "./useNotification";

import Button from "@material-ui/core/Button";
import { fetch, waitPromiseTimeout } from "./../utils";
import { Notification } from "./../components/Notification/Notification";
import GetAppIcon from "@material-ui/icons/GetApp";

import events from "./../components/ActionProgress/events";
const { WITH_ACTION_PROGRESS } = events;

export function useDonwloadBackup() {
  const { apiServer, bus } = useAppContext();
  const addNotification = useNotification();

  const [downloadStart, setDownloadStart] = useState(() => false);

  useEffect(() => {
    if (downloadStart) {
      const promise = waitPromiseTimeout(
        fetch(`${apiServer}/api/v1/data/_backup`).then(res => res.json())
      );
      const label = `Backup creation in progress...`;
      bus.emit(WITH_ACTION_PROGRESS, { promise, label });
      promise.then(data => {
        if (typeof data !== "undefined" && typeof data?.path === "string") {
          addNotification(
            <Notification severity="success">
              <form method="get" action={`${apiServer}/${data.path}`}>
                <Button
                  size="small"
                  type="submit"
                  aria-label="download"
                  aria-controls="action-menu"
                  startIcon={<GetAppIcon />}
                >
                  Download Backup
                </Button>
              </form>
            </Notification>
          );
        }
      });
    }
  }, [downloadStart]);

  return () => {
    setDownloadStart(true);
  };
}
