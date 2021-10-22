import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { formatNumber } from "./../../../../utils";

const divider = 1e18;
export const BalanceAndWorkerInfo = ({ worker, balance }) => {
  const classes = useStyles();
  const { balance: unpaid = 0, balanceCountervalue = 0 } = balance || {};
  const { coinName, walletName, workerName, poolName, minerName, algo } =
    worker;

  const unpaidCoin = formatNumber(unpaid / divider, 6);
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
              {unpaidCoin} {coinName}{" "}
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Balance{" "}
              <span className={classes.ValueDollar}>
                ≈ ${balanceCountervalue}
              </span>
            </Typography>
          </div>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6" className={classes.text}>
              {poolName}
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Pool
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
    padding: "8px 16px"
  },
  Wrapper: {
    display: "flex",
    width: "100%",
    border: "1px solid #e8eff7",
    borderRadius: "5px",
    padding: "16px",
    flex: 0.8
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
    flex: 1
  },
  infoBarWrapper: { flex: 1, display: "flex", justifyContent: "space-between" },
  infoBox: {
    display: "flex",
    flexDirection: "column",
    "& > h6": { fontWeight: "bolder", fontSize: "16px" }
  },
  text: { textTransform: "capitalize" }
});
