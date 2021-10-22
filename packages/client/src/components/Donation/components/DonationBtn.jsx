import React from "react";
import { makeStyles } from "@material-ui/core/styles";

export function DonationBtn({ logo, coin, onClick, coinPicked }) {
  const classes = useStyles();

  return (
    <button
      data-selected={coinPicked.name === coin.name}
      onClick={() => onClick?.(coin)}
      className={classes.DonationBtn}
    >
      <img className={classes.img} src={logo} alt={coin.name} />
      <span className={classes.tickerName}>{coin.name}</span>
    </button>
  );
}

const useStyles = makeStyles(() => ({
  DonationBtn: {
    minWidth: "123px",
    cursor: "pointer",
    padding: "8px 24px",
    margin: "2px",
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
    border: "1px solid rgba(25, 118, 210, 0.5)",
    color: "rgb(25, 118, 210)",
    outline: "none",
    background: "none",
    "&:hover[data-selected='false']": {
      backgroundColor: "rgba(25, 118, 210, 0.04)",
      border: "1px solid rgb(25, 118, 210)"
    },
    "&[data-selected='true']": {
      backgroundColor: "rgba(25, 118, 210, 0.4)",
      border: "1px solid rgb(25, 118, 210)"
    }
  },
  tickerName: {
    marginLeft: "8px",
    fontWeight: "800"
  },
  img: {
    height: "32px",
    width: "auto"
  }
}));
