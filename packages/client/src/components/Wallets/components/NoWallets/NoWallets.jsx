import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import WalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  NoWallets: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    display: "flex",
    justifyContent: "center"
  },
  button: { marginTop: "32px" },
  icon: { marginRight: "8px" },
  textSecondary: { marginTop: "24px" }
});

export function NoWallets({ toggleAddWallet }) {
  const classes = useStyles();

  return (
    <div className={classes.NoWallets}>
      <Typography variant="h4">
        <WalletOutlinedIcon className={classes.icon} />
        No Wallets!
      </Typography>
      <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes.button}
        startIcon={<AddIcon />}
        onClick={toggleAddWallet}
      >
        Add New wallet
      </Button>
      <Typography className={classes.textSecondary} color="textSecondary">
        You do not have any wallet yet! Please add a wallet!
      </Typography>
    </div>
  );
}
