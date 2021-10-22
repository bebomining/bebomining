import React, { useState } from "react";
import { useParams, useHistory, useRouteMatch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/DeleteOutlineTwoTone";
import BackIcon from "@material-ui/icons/KeyboardBackspace";
import IconButton from "@material-ui/core/IconButton";
import FileCopyIcon from "@material-ui/icons/FileCopy";

import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { ConfirmModal } from "./../../../ConfirmModal/ConfirmModal";
import { NoCoins } from "./../NoCoins/NoCoins";

import { useFetch } from "./../../../../hooks/useFetch";
import { useAppContext } from "./../../../../hooks/useAppContext";
import { useNotificationError } from "./../../../../hooks/useNotificationError";
import { waitPromiseTimeout, fetch } from "./../../../../utils";
import events from "./../../../ActionProgress/events";
const { WITH_ACTION_PROGRESS } = events;

const emptyTarget = { target: null, status: false };

export function WalletDetails() {
  const classes = useStyles();
  const [modal, setShowModal] = useState(() => emptyTarget);
  const [actionsDisabled, setDisableAllAction] = useState(() => false);

  const { apiServer, bus } = useAppContext();
  const { walletName } = useParams();
  const match = useRouteMatch();
  const history = useHistory();

  const { loading, data, error, updateData } = useFetch(
    `${apiServer}/api/v1/coins?walletName=${walletName}`
  );
  useNotificationError(error);

  if (loading || loading === null) {
    return (
      <div className={classes.loadingBar}>
        <CircularProgress />
      </div>
    );
  }

  const onRemoveCoin = ({ id: targetId }) => {
    updateData(prev => ({
      ...prev,
      results: prev.results.filter(({ rowid }) => rowid !== targetId)
    }));
  };

  const toggleRemoveModal = (target = emptyTarget) =>
    setShowModal(prev => ({ ...prev, target, status: !prev.status }));

  const onConfirm = async () => {
    const { walletName, coinName, rowid: id } = modal.target;
    setDisableAllAction(true);
    toggleRemoveModal();
    try {
      const url = `${apiServer}/api/v1/coins/${id}`;
      const promise = waitPromiseTimeout(fetch(url, { method: "DELETE" }));
      const label = `Deleting Coin: '${coinName}' from wallet '${walletName}'...`;
      bus.emit(WITH_ACTION_PROGRESS, { promise, label });
      const result = await promise;
      onRemoveCoin({ id });
      console.log("onDelete Coin", result);
    } catch (err) {
      console.error(err);
    } finally {
      setDisableAllAction(false);
    }
  };

  const goBack = () => {
    history.push(`/wallets`);
  };

  const addNewCoin = () => {
    history.push(`${match.url}/add-coin?redirect=/wallets/${walletName}`);
  };

  const copyAddress = address => navigator.clipboard.writeText(address);

  const { results } = data;
  const hasNoCoins = results?.length <= 0;

  if (hasNoCoins) {
    return <NoCoins walletName={walletName} />;
  }

  return (
    <div className={classes.WalletDetails}>
      <div className={classes.NavBar}>
        <Button
          disabled={actionsDisabled}
          size="small"
          variant="contained"
          startIcon={<BackIcon />}
          className={classes.backButton}
          disableElevation
          onClick={goBack}
        >
          Back
        </Button>
      </div>

      <div className={classes.root}>
        <TableContainer className={classes.table}>
          <Table aria-label="coins details">
            <TableHead>
              <TableRow>
                <TableCell className={classes.TableHead}>Coin Name</TableCell>
                <TableCell className={classes.TableHead}>Address</TableCell>
                <TableCell className={classes.TableHead}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map(({ walletName, coinName, address, rowid }) => (
                <TableRow key={coinName}>
                  <TableCell component="th" scope="row">
                    <div className={classes.coinName}>
                      <img
                        alt={coinName}
                        src={`./icons/${coinName}.png`}
                        onError={event => {
                          const img = event.target;
                          img.src = `./icons/notfound.png`;
                        }}
                      />
                      <span>{coinName}</span>
                    </div>
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    title={address}
                    className={classes.ellipsis}
                  >
                    <div className={classes.address}>
                      <span className="text-ellipsis">{address}</span>
                      <IconButton
                        title={`Copy ${coinName} Address`}
                        className={classes.CopyButton}
                        size="small"
                        onClick={() => copyAddress(address)}
                        aria-label={`Copy ${coinName} Address`}
                      >
                        <FileCopyIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Button
                      disabled={actionsDisabled}
                      size="small"
                      title={`Remove ${coinName}`}
                      disableElevation
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      onClick={() =>
                        toggleRemoveModal({ coinName, walletName, rowid })
                      }
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.buttonAdd}
          startIcon={<AddIcon />}
          onClick={addNewCoin}
        >
          Add Coin to {walletName}
        </Button>
      </div>
      {modal.status && (
        <ConfirmModal
          content={contentModal}
          onCancel={() => toggleRemoveModal()}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}

const contentModal =
  "Deleting a coin will remove the 'idle' workers which are using it";

const useStyles = makeStyles(theme => ({
  table: { flex: 1, "& table": { border: "1px solid #CCC" } },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    padding: "8px"
  },
  WalletDetails: { display: "flex", flexDirection: "column", flex: 1 },
  loadingBar: {
    flex: 1,
    alignItems: "center",
    display: "flex",
    justifyContent: "center"
  },
  NavBar: {
    width: "100%",
    display: "flex",
    padding: "16px 8px"
  },
  TableHead: {
    fontWeight: "bold"
  },
  ellipsis: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "380px",
    overflow: "hidden"
  },
  coinName: {
    display: "flex",
    alignItems: "center",
    "& > img": { height: "26px", marginRight: "4px" }
  },
  address: {
    display: "flex",
    alignItems: "center",
    "& > span": { marginRight: "4px" }
  },
  buttonAdd: {
    position: "absolute",
    top: "auto",
    bottom: "16px",
    left: "auto",
    right: "16px"
  }
}));
