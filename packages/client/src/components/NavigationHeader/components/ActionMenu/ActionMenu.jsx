import React, { useState, useEffect } from "react";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { RestoreFromBackup } from "./RestoreFromBackup";

import { useAppContext } from "./../../../../hooks/useAppContext";

import { useCloseApp } from "./../../../../hooks/useCloseApp";
import { useDonwloadBackup } from "./../../../../hooks/useDonwloadBackup";
import { useRestartApp } from "./../../../../hooks/useRestartApp";

import {
  ON_PLAY_WORKER_START,
  ON_PLAY_WORKER_END_SUCCESS,
  ON_PLAY_WORKER_END_ERROR,
  ON_STOP_WORKER_START,
  ON_STOP_WORKER_END_SUCCESS,
  ON_STOP_WORKER_END_ERROR
} from "./../../../Workers/events";

const options = [
  { id: 0, label: "Data backup" },
  { id: 1, label: "Restore from backup" },
  { id: 2, label: "Restart App" },
  { id: 3, label: "Close App" }
];

export function ActionMenu() {
  const [anchorEl, setAnchorEl] = useState(() => null);
  const open = Boolean(anchorEl);

  const [showRestore, setShowRestore] = useState(() => false);
  const closeApp = useCloseApp();
  const donwloadBackup = useDonwloadBackup();
  const restartApp = useRestartApp();
  const { bus } = useAppContext();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const onCancelRestore = () => {
    setShowRestore(false);
  };

  const handleClose = ({ id }) => {
    switch (id) {
      case 0: {
        donwloadBackup();
        break;
      }
      case 1: {
        setShowRestore(true);
        break;
      }
      case 2: {
        restartApp();
        break;
      }
      case 3: {
        closeApp();
        break;
      }
    }
    setAnchorEl(null);
  };

  const [disableBtn, setDisableBtn] = useState(() => false);
  useEffect(() => {
    const disable = () => setDisableBtn(true);
    const enable = () => setDisableBtn(false);

    bus.on(ON_PLAY_WORKER_START, disable);
    bus.on(ON_STOP_WORKER_START, disable);

    bus.on(ON_PLAY_WORKER_END_SUCCESS, enable);
    bus.on(ON_PLAY_WORKER_END_ERROR, enable);

    bus.on(ON_STOP_WORKER_END_SUCCESS, enable);
    bus.on(ON_STOP_WORKER_END_ERROR, enable);

    return () => {
      bus.off(ON_PLAY_WORKER_START, disable);
      bus.off(ON_STOP_WORKER_START, disable);

      bus.off(ON_PLAY_WORKER_END_SUCCESS, enable);
      bus.off(ON_PLAY_WORKER_END_ERROR, enable);

      bus.off(ON_STOP_WORKER_END_SUCCESS, enable);
      bus.off(ON_STOP_WORKER_END_ERROR, enable);
    };
  }, []);

  return (
    <div>
      <IconButton
        disabled={disableBtn}
        style={{ color: "white" }}
        aria-label="more"
        aria-controls="action-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        {options.map(option => (
          <MenuItem key={option.label} onClick={() => handleClose(option)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
      {showRestore && <RestoreFromBackup onCancel={onCancelRestore} />}
    </div>
  );
}
