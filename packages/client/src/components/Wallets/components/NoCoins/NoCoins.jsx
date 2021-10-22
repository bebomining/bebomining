import React from "react";
import { useRouteMatch, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import WalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  NoCoins: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    display: "flex",
    justifyContent: "center"
  },
  button: { marginTop: "32px" },
  icon: { marginRight: "8px" }
});

export function NoCoins({ walletName }) {
  const classes = useStyles();

  const history = useHistory();
  const match = useRouteMatch();

  const addNewCoin = () => history.push(`${match.url}/add-coin`);

  return (
    <div className={classes.NoCoins}>
      <Typography variant="h4">
        <WalletOutlinedIcon className={classes.icon} />
        <b>{walletName}</b> contains no coins!
      </Typography>
      <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes.button}
        startIcon={<AddIcon />}
        onClick={addNewCoin}
      >
        Add a new coin to {walletName}
      </Button>
    </div>
  );
}
