import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CircularProgress from "@material-ui/core/CircularProgress";

import { CloudConnector } from "./components/CloudConnector";

import { useFetch } from "./../../hooks/useFetch";
import { useAppContext } from "./../../hooks/useAppContext";
import { useNotificationError } from "./../../hooks/useNotificationError";

const copyLink = rigURL => navigator.clipboard.writeText(rigURL);
const CLOUD_CLIENT_URL = process.env.REACT_APP_CLOUD_CLIENT;

export function CloudSettings() {
  const classes = useStyles();
  const [rigID, setRigId] = useState(() => null);
  const { apiServer } = useAppContext();

  const { data, loading, error } = useFetch(
    `${apiServer}/api/v1/settings/cloud`
  );

  useNotificationError(error);

  useEffect(() => {
    if (data?.result?.rigID.trim?.() !== "") {
      setRigId(data?.result.rigID);
    }
  }, [data]);

  if (loading || loading === null || rigID === null) {
    return (
      <div className={classes.loadingBar}>
        <CircularProgress />
      </div>
    );
  }

  const onRefreshID = rigID => setRigId(rigID);

  const rigsURL = `${CLOUD_CLIENT_URL}/#/rigs/${rigID}/workers`;

  return (
    <div className={classes.CloudSettings}>
      <Typography
        variant="h3"
        component="h1"
        color="textSecondary"
        gutterBottom
      >
        Cloud Settings
      </Typography>
      <Typography component="p" paragraph>
        By enabling the cloud remote control you will be able to manage your
        rigs remotely.
      </Typography>
      <div className={classes.CloudConnector}>
        <CloudConnector settings={data.result} onRefreshID={onRefreshID} />
      </div>
      <div className={classes.address}>
        <Typography className={classes.rigsURL} component="p" paragraph>
          {rigsURL}
        </Typography>
        <Button
          title={`Copy Link`}
          className={classes.CopyButton}
          color="primary"
          size="small"
          variant="contained"
          startIcon={<FileCopyIcon />}
          onClick={() => copyLink(rigsURL)}
          aria-label={`Copy Link`}
        >
          Copy Link
        </Button>
      </div>
      <div className={classes.QRCode}>
        <QRCode value={rigsURL} />
      </div>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  loadingBar: {
    width: "100%",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  address: {
    display: "flex",
    alignItems: "center",
    padding: "8px",
    borderRadius: "4px",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.03)"
  },
  rigsURL: {
    fontSize: "15px",
    fontWeight: "bold",
    alignItems: "center",
    marginBottom: "0"
  },
  CloudSettings: {
    padding: "36px 0",
    height: "100%",
    width: "80%",
    margin: "auto",
    display: "flex",
    flexDirection: "column"
  },
  CloudConnector: {
    marginBottom: "24px",
    display: "flex"
  },
  QRCode: {
    padding: "32px 16px",
    display: "flex",
    marginTop: "24px",
    width: "100%",
    justifyContent: "center",
    borderRadius: "4px",
    backgroundColor: "rgba(0, 0, 0, 0.03)"
  },
  CopyButton: {
    flexShrink: 0,
    minWidth: "116px"
  }
}));
