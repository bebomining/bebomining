import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import { BtnInstall } from "./BtnInstall";

import Typography from "@material-ui/core/Typography";
export function CardMiner({
  minerName,
  nameWithTag,
  tag_name,
  supports,
  html_url,
  assets,
  id
}) {
  const classes = useStyles();

  return (
    <div className={classes.CardWrapper}>
      <Card title={minerName} className={classes.root} variant="outlined">
        <CardContent>
          <Typography
            title={`Name: ${minerName}`}
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            <span style={{ maxWidth: "180px" }} className="text-ellipsis">
              {minerName}
            </span>
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            className={classes.textPrimary}
          >
            {nameWithTag}
          </Typography>
          <Typography className={classes.textSecondary} color="textSecondary">
            <span className="text-ellipsis">Supports: {supports}</span>
          </Typography>
          <Typography
            variant="body2"
            component="p"
            className={classes.WalletInfo}
          >
            <span title={`Wallet Name: ${html_url}`} className="text-ellipsis">
              <a
                title={tag_name}
                target="_blank"
                href={html_url}
                rel="noreferrer"
              >
                {html_url}
              </a>
            </span>
          </Typography>
        </CardContent>
        <CardActions className={classes.CardActions}>
          <BtnInstall
            assetId={assets.id}
            releaseId={id}
            minerName={minerName}
          />
        </CardActions>
      </Card>
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    position: "relative",
    width: "100%",
    textAlign: "left"
  },
  title: { fontSize: 14 },
  textSecondary: { marginBottom: 12, textTransform: "lowercase" },
  textPrimary: { textTransform: "uppercase" },
  CardWrapper: {
    width: "33.33%",
    padding: "4px",
    ["@media (max-width:900px)"]: {
      width: "50%"
    },
    ["@media (max-width:624px)"]: {
      width: "100%"
    }
  },
  WalletInfo: {
    display: "flex",
    alignItems: "center",
    "& span": { marginLeft: "4px" }
  },
  CardActions: { justifyContent: "flex-end" }
});
