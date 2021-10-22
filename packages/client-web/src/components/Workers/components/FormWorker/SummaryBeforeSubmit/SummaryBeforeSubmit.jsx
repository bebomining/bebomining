import React from "react";
import { useForm } from "usetheform";
import { makeStyles } from "@material-ui/core/styles";

export function SummaryBeforeSubmit() {
  const { state } = useForm();
  const classes = useStyles();

  const { activeStep: omitStep, minerMode, poolConfig, miner, ...rest } = state;

  const { minerInfo, gpus } = miner;

  const summary =
    minerMode === "gpu"
      ? { ...rest, ...poolConfig, ...minerInfo, gpus }
      : { ...rest, ...poolConfig, ...minerInfo };

  return (
    <div className={classes.Summary}>
      {Object.keys(mapKeysToLabel)
        .filter(key => summary[key])
        .map(key => (
          <div className={classes.Tag} key={key}>
            <span className={classes.TagTitle}>{`${mapKeysToLabel[key]}`}</span>
            :<span className={classes.Tagspan}>{`${summary[key]}`}</span>
          </div>
        ))}
    </div>
  );
}

const useStyles = makeStyles({
  Summary: {
    flex: 1,
    flexWrap: "wrap",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    maxWidth: "640px",
    margin: "auto",
    maxHeight: "246px",
    overflow: "auto"
  },
  Tag: {
    padding: "6px 14px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ededed",
    margin: "4px"
  },
  Tagspan: {
    marginLeft: "4px",
    textDecoration: "underline",
    fontWeight: "bold",
    fontSize: "18px"
  },
  TagTitle: { textTransform: "uppercase" }
});

const mapKeysToLabel = {
  workerName: "Worker Name",
  walletName: "Wallet",
  coinName: "Coin",
  poolName: "Pool Name",
  poolRegion: "Pool Region",
  poolPort: "Pool Port",
  minerName: "Miner",
  gpus: "Gpus",
  algo: "Algorithm"
};
