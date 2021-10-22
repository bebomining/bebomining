import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

export const HashInfo = ({ worker, hashrate, balance }) => {
  const { coinName } = worker;
  const classes = useStyles();

  const {
    currentEffectiveHashrate = 0,
    reportedHashrate = 0,
    performanceUnit = "-/-"
  } = hashrate || {};

  const { total24h = 0, referralBalance = 0 } = balance || {};

  return (
    <div className={classes.root}>
      <div className={classes.Wrapper}>
        <div className={classes.infoBarWrapper}>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {currentEffectiveHashrate} {performanceUnit}
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Current Hashrate
            </Typography>
          </div>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {reportedHashrate} {performanceUnit}
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Reported Hashrate
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.WrapperShares}>
        <div className={classes.infoBarWrapper}>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {total24h} {coinName}
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Past 24h rewards
            </Typography>
          </div>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {referralBalance} {coinName}
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Referral balance
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
