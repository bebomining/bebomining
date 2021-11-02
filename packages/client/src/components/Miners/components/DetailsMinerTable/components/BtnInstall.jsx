import React from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useInstallAsset } from "./../../../../../hooks/useInstallAsset";
import { useCheckInstalled } from "./../../../../../hooks/useCheckInstalled";
import { useNotificationError } from "./../../../../../hooks/useNotificationError";
import { useAppContext } from "../../../../../hooks/useAppContext";
import {
  ON_MINER_INSTALLED_SUCCESS,
  ON_MINER_INSTALLED_ERROR
} from "../../../events";

const style = { minWidth: "111px", minHeight: "36px" };
const noop = () => null;

export function BtnInstall({ assetId, releaseId, minerName }) {
  const { install, loading, data, error } = useInstallAsset();
  const { checking, data: installed } = useCheckInstalled({ minerName });
  const { bus } = useAppContext();

  useNotificationError(error);

  const isInstalled =
    installed &&
    installed.status === "success" &&
    installed.results.find(({ assetId: target }) => assetId === target) !==
      undefined;

  const label =
    isInstalled || (data && data.status === "success")
      ? "Reinstall"
      : "Install";

  const color =
    isInstalled || (data && data.status === "success")
      ? "secondary"
      : "primary";

  const disabled = checking || checking === null || loading === true;
  const installAction = !disabled
    ? async () => {
        try {
          await install({ assetId, releaseId, minerName });
          bus.emit(ON_MINER_INSTALLED_SUCCESS, {
            assetId,
            releaseId,
            minerName
          });
        } catch {
          bus.emit(ON_MINER_INSTALLED_ERROR, { assetId, releaseId, minerName });
        }
      }
    : noop;

  return (
    <Button
      style={style}
      size="medium"
      variant="contained"
      disabled={disabled}
      onClick={installAction}
      color={color}
    >
      {!loading ? label : <CircularProgress size={20} />}
    </Button>
  );
}
