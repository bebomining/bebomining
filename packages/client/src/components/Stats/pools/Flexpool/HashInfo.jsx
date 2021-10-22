import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { formatNumber } from "./../../../../utils";

const hs = 1000000;
export const HashInfo = ({ worker, hashrate }) => {
  console.log(worker);
  const classes = useStyles();
  const {
    currentEffectiveHashrate = 0,
    averageEffectiveHashrate = 0,
    validShares = 0,
    staleShares = 0,
    invalidShares = 0
  } = hashrate || {};

  const currentHashrate = formatNumber(currentEffectiveHashrate / hs);
  const averageHashrate = formatNumber(averageEffectiveHashrate / hs);

  const totalShares = validShares + invalidShares;
  const stalePerc =
    totalShares === 0 ? 0 : formatNumber((100 * staleShares) / totalShares);
  const invalidPerc =
    totalShares === 0 ? 0 : formatNumber((100 * invalidShares) / totalShares);
  const validPerc = totalShares === 0 ? 0 : 100 - stalePerc - invalidPerc;

  return (
    <div className={classes.root}>
      <div className={classes.Wrapper}>
        <div className={classes.infoBarWrapper}>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {currentHashrate} mh/s
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Current Hashrate
            </Typography>
          </div>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {averageHashrate} mh/s
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Average Hashrate
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.WrapperShares}>
        <div className={classes.infoBarWrapper}>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {validShares}{" "}
              <span className={classes.infoSecondary}>({validPerc}%)</span>
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Valid Shares
            </Typography>
          </div>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {staleShares}{" "}
              <span className={classes.infoSecondary}>({stalePerc}%)</span>
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Stale Shares
            </Typography>
          </div>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {invalidShares}{" "}
              <span className={classes.infoSecondary}>({invalidPerc}%)</span>
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Invalid Shares
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
  WrapperShares: {
    display: "flex",
    width: "100%",
    border: "1px solid #e8eff7",
    borderRadius: "5px",
    padding: "16px",
    flex: 1,
    marginLeft: "16px"
  },
  infoBarWrapper: { flex: 1, display: "flex", justifyContent: "space-between" },
  infoBox: {
    display: "flex",
    flexDirection: "column",
    "& > h6": { fontWeight: "bolder", fontSize: "16px" }
  },
  infoBar: {
    fontSize: 16,
    fontWeight: "bolder",
    display: "flex",
    alignItems: "center",
    "& > span": { marginRight: "4px" }
  },
  infoSecondary: {
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.54)"
  }
});
