import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { CardMiner } from "./components/CardMiner";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: "6px",
    overflow: "auto",
    height: "100%",
    margin: "auto",
    width: "100%"
  }
});

export function DetailsMinerTable({ minersInfo }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {minersInfo.map(({ id, ...props }) => (
        <CardMiner key={id} id={id} {...props} />
      ))}
    </div>
  );
}
