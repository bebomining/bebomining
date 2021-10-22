import React from "react";
import { useHistory } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

import { WalletCard } from "./../WalletCard/WalletCard";
import { useFetch } from "./../../../../hooks/useFetch";
import { NoWallets } from "./../NoWallets/NoWallets";

export function WalletList({ match }) {
  const classes = useStyles();

  const history = useHistory();

  const { loading, data, error, updateData } = useFetch(`wallets`);

  if (loading || loading === null) {
    return (
      <div className={classes.loadingBar}>
        <CircularProgress />
      </div>
    );
  }

  const toggleAddWallet = () => {
    const { rigId } = match.params;
    history.push(`/rigs/${rigId}/wallets/add-wallet`);
  };

  const handleChange = (event, walletName) => {
    history.push(`${match.path}/${walletName}`);
  };

  const onRemoveWallet = ({ id: targetId }) => {
    updateData(prev => ({
      ...prev,
      results: prev.results.filter(({ id }) => id !== targetId)
    }));
  };

  const results = data?.results || [];
  const hasNoWallets = error?.statusCode === 404 || results.length <= 0;
  if (hasNoWallets) {
    return <NoWallets toggleAddWallet={toggleAddWallet} />;
  }

  return (
    <div className={classes.Wallets}>
      <div className={classes.NavBar}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={toggleAddWallet}
        >
          Add New Wallet
        </Button>
      </div>
      <div className={classes.root}>
        {results.map(({ walletName, ...rest }) => (
          <WalletCard
            onRemoveWallet={onRemoveWallet}
            key={walletName}
            onClick={handleChange}
            walletName={walletName}
            {...rest}
          />
        ))}
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  Wallets: {
    flex: 1,
    flexDirection: "column",
    position: "relative",
    display: "flex",
    overflow: "hidden"
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexWrap: "wrap",
    padding: "6px",
    overflow: "auto"
  },
  NavBar: {
    width: "100%",
    display: "flex",
    padding: "16px 8px"
  },
  loadingBar: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));
