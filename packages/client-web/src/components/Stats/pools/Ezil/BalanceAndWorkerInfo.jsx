import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { formatNumber } from "./../../../../utils";

export const BalanceAndWorkerInfo = ({ worker, balance = {}, rates = {} }) => {
  const classes = useStyles();

  const { coinName, walletName, workerName, minerName, algo } = worker;
  const [coin1, coin2] = coinName.split("+");

  const balanceCoin1 = balance?.[coin1.toLowerCase()] || 0;
  const unpaidCoin1 = formatNumber(balanceCoin1, 8);

  const balanceCoin2 = balance?.[coin2.toLowerCase()] || 0;
  const unpaidCoin2 = formatNumber(balanceCoin2, 8);

  const ratesCoin1 = rates?.[coin1]?.["USD"] || 0;
  const balanceCountervalueCoin1 = formatNumber(ratesCoin1 * unpaidCoin1, 2);

  const ratesCoin2 = rates?.[coin2]?.["USD"] || 0;
  const balanceCountervalueCoin2 = formatNumber(ratesCoin2 * unpaidCoin2, 2);

  return (
    <div className={classes.root}>
      <div className={classes.Wrapper}>
        <div className={classes.infoBarWrapper}>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6" title={workerName}>
              <span style={{ maxWidth: "170px" }} className="text-ellipsis">
                {workerName}
              </span>
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Worker
            </Typography>
          </div>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              <span className={classes.text}>{minerName}</span> -{" "}
              {algo.toLowerCase()}
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Miner Software
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.WrapperPool}>
        <div className={classes.infoBarWrapper}>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {unpaidCoin1} {coin1}{" "}
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Balance{" "}
              <span className={classes.ValueDollar}>
                ≈ ${balanceCountervalueCoin1}
              </span>
            </Typography>
          </div>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {unpaidCoin2} {coin2}{" "}
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Balance{" "}
              <span className={classes.ValueDollar}>
                ≈ ${balanceCountervalueCoin2}
              </span>
            </Typography>
          </div>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6" className={classes.text}>
              <span style={{ maxWidth: "130px" }} className="text-ellipsis">
                {walletName}
              </span>
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Wallet
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    position: "relative",
    width: "100%",
    display: "flex",
    padding: "8px 16px",
    flexShrink: "0",
    ["@media (max-width:980px)"]: {
      width: "initial",
      overflow: "auto"
    }
  },
  Wrapper: {
    display: "flex",
    width: "100%",
    border: "1px solid #e8eff7",
    borderRadius: "5px",
    padding: "16px",
    flex: 0.8,
    ["@media (max-width:980px)"]: {
      flex: "initial",
      width: "80%",
      flexShrink: 0
    },
    ["@media (max-width:500px)"]: {
      flex: "initial",
      width: "initial",
      flexShrink: 0
    },
    ["@media (max-width:370px)"]: {
      width: "100%"
    }
  },
  ValueDollar: {
    fontSize: "14px"
  },
  WrapperPool: {
    display: "flex",
    width: "100%",
    border: "1px solid #e8eff7",
    borderRadius: "5px",
    padding: "16px",
    marginLeft: "16px",
    flex: 1,
    ["@media (max-width:980px)"]: {
      flex: "initial",
      width: "initial",
      flexShrink: 0
    },
    ["@media (max-width:500px)"]: {
      flex: "initial",
      width: "initial",
      flexShrink: 0
    }
  },
  infoBarWrapper: { flex: 1, display: "flex", justifyContent: "space-between" },
  infoBox: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "71px",
    flexShrink: 0,
    "& > h6": { fontWeight: "bolder", fontSize: "16px" },
    "&:first-child": { marginLeft: "0" }
  },
  text: { textTransform: "capitalize" }
});
