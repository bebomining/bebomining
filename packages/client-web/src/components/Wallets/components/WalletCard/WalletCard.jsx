import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import Button from "@material-ui/core/Button";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import WalletTwoToneIcon from "@material-ui/icons/AccountBalanceWalletTwoTone";

import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import { useAppContext } from "./../../../../hooks/useAppContext";
import { waitPromiseTimeout, fetch } from "./../../../../utils";

import { WorkerCounter } from "./components/WorkerCounter";
import { CoinsCounter } from "./components/CoinsCounter";

import { ConfirmModal } from "./../../../ConfirmModal/ConfirmModal";

import events from "./../../../ActionProgress/events";
const { WITH_ACTION_PROGRESS } = events;

export function WalletCard({ walletName, id, onRemoveWallet }) {
  const classes = useStyles();
  const [showModal, setShowModal] = useState(() => false);
  const [actionsDisabled, setDisableAllAction] = useState(() => false);

  const { bus } = useAppContext();
  const history = useHistory();
  const match = useRouteMatch();

  const visitWallet = () => {
    const { rigId } = match.params;
    history.push(`/rigs/${rigId}/wallets/${walletName}`);
  };
  const addNewCoin = () => {
    const { rigId } = match.params;
    history.push(`/rigs/${rigId}/wallets/${walletName}/add-coin`);
  };

  const toggleRemoveModal = () => setShowModal(prev => !prev);

  const onConfirm = async () => {
    setDisableAllAction(true);
    toggleRemoveModal();
    try {
      const url = `wallets/${id}`;
      const promise = waitPromiseTimeout(fetch(url, { method: "DELETE" }));
      const label = `Deleting Wallet: ${walletName}...`;
      bus.emit(WITH_ACTION_PROGRESS, { promise, label });
      await promise;
      onRemoveWallet({ walletName, id });
    } catch (err) {
      console.error(err);
    } finally {
      setDisableAllAction(false);
    }
  };

  return (
    <div className={classes.CardWrapper}>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <div className={classes.WalletName}>
            <WalletTwoToneIcon />
            <Typography variant="h5" component="h2">
              {walletName}
            </Typography>
          </div>

          <WorkerCounter walletName={walletName} />
          <CoinsCounter walletName={walletName} />
        </CardContent>
        <CardActions className={classes.CardActions}>
          <Button
            disabled={actionsDisabled}
            className={classes.buttons}
            aria-label="Add coins"
            size="small"
            onClick={addNewCoin}
            startIcon={<AddIcon />}
            title={`Add coins to ${walletName}`}
          >
            Add coins
          </Button>

          <Button
            size="small"
            disabled={actionsDisabled}
            className={classes.buttons}
            aria-label="Delete"
            startIcon={<DeleteForeverIcon />}
            title={`Delete ${walletName} wallet`}
            onClick={toggleRemoveModal}
          >
            Delete
          </Button>
        </CardActions>
        <div className={classes.buttonCover} onClick={visitWallet} />
      </Card>
      {showModal && (
        <ConfirmModal
          content={contentModal}
          onCancel={toggleRemoveModal}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}

const contentModal =
  "Deleting a wallet will remove all the contained coins and as well as the 'idle' workers which are using it";

const useStyles = makeStyles({
  root: {
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    position: "relative",
    "&:hover, &:focus": { boxShadow: "0px 10px 13px -7px #e0e0e0" }
  },
  CardWrapper: {
    width: "33.33%",
    padding: "4px",
    position: "relative",
    zIndex: 1,
    ["@media (max-width:900px)"]: {
      width: "50%"
    },
    ["@media (max-width:624px)"]: {
      width: "100%"
    }
  },
  buttonCover: {
    width: "100%",
    position: "absolute",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 1
  },
  WalletName: {
    display: "flex",
    alignItems: "center",
    marginBottom: "2px",
    "& > h2": { marginLeft: "4px" }
  },
  CoinCounter: { display: "flex", alignItems: "center" },
  CircularProgress: { marginLeft: "8px" },
  buttons: { zIndex: 2, position: "relative" },
  CardActions: { display: "flex", justifyContent: "space-between" }
});
