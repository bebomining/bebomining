import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import FileCopyIcon from "@material-ui/icons/FileCopy";

import { DonationBtn } from "./components/DonationBtn";
import { useFetch } from "./../../hooks/useFetch";
import { useNotificationError } from "./../../hooks/useNotificationError";

import QRCode from "qrcode.react";

const copyAddress = address => navigator.clipboard.writeText(address);

export function Donation() {
  const classes = useStyles();

  const [coinPicked, setCoinPicked] = useState(() => null);
  const { data, loading, error } = useFetch(`donations`);
  useNotificationError(error);

  useEffect(() => {
    if (data && data?.results) {
      setCoinPicked(data.results[0]);
    }
  }, [data]);

  if (loading || loading === null || coinPicked === null) {
    return (
      <div className={classes.loadingBar}>
        <CircularProgress />
      </div>
    );
  }

  const handleOnClick = coinPicked => {
    setCoinPicked(coinPicked);
  };

  return (
    <div className={classes.Donation}>
      <Typography
        variant="h3"
        component="h1"
        color="textSecondary"
        gutterBottom
      >
        Donation
      </Typography>
      <Typography component="p" paragraph>
        The software is free to download and use. There are no ads, popups, or
        links to products for sale. It is maintained by the creator (BeBo) with
        no funding or support from any sources. If you like the software,
        please, donation is appreciated and it helps to keep the software
        development active. Thanks.
      </Typography>
      <div className={classes.ButtonCoins}>
        {data.results.map(coin => (
          <DonationBtn
            key={coin.name}
            coinPicked={coinPicked}
            coin={coin}
            onClick={handleOnClick}
            logo={`icons/${coin.name}.png`}
          />
        ))}
      </div>
      <div className={classes.address}>
        <Typography className={classes.coinPicked} component="p" paragraph>
          <span className="text-ellipsis"> {coinPicked.value}</span>
        </Typography>
        <Button
          title={`Copy ${coinPicked.name} Address`}
          className={classes.CopyButton}
          color="primary"
          size="small"
          variant="contained"
          startIcon={<FileCopyIcon />}
          onClick={() => copyAddress(coinPicked.value)}
          aria-label={`Copy ${coinPicked.name} Address`}
        >
          Copy Address
        </Button>
      </div>
      <div className={classes.QRCode}>
        <QRCode value={coinPicked.value} />
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
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    ["@media (max-width:624px)"]: {
      flexDirection: "column"
    }
  },
  CopyButton: {
    flexShrink: "0",
    ["@media (max-width:624px)"]: {
      marginTop: "16px",
      width: "100%"
    }
  },
  coinPicked: {
    fontSize: "15px",
    fontWeight: "bold",
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginBottom: "0"
  },
  Donation: {
    padding: "36px",
    height: "100%",
    width: "100%",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    ["@media (max-width:624px)"]: {
      padding: "24px 16px"
    }
  },
  ButtonCoins: {
    marginBottom: "24px",
    display: "flex",
    flexWrap: "wrap",
    flexShrink: "0",
    ["@media (max-width:624px)"]: {
      flexWrap: "initial",
      overflow: "auto",
      marginBottom: "18px",
      paddingBottom: "12px"
    }
  },
  QRCode: {
    padding: "32px 16px",
    display: "flex",
    marginTop: "24px",
    width: "100%",
    justifyContent: "center",
    borderRadius: "4px",
    backgroundColor: "rgba(0, 0, 0, 0.03)"
  }
}));
