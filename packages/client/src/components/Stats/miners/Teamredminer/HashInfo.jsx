import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { formatNumber } from "./../../../../utils";

export const HashInfo = ({ session }) => {
  const classes = useStyles();

  if (!session) {
    return null;
  }

  const { uptime, activeGPUs, totalPower, performance, performanceUnit } =
    session;

  return (
    <div className={classes.root}>
      <div className={classes.Wrapper}>
        <div className={classes.infoBarWrapper}>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {performance} {performanceUnit}
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Total Hashrate
            </Typography>
          </div>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {formatNumber(totalPower)} W
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Total Power
            </Typography>
          </div>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {activeGPUs}
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              GPUs
            </Typography>
          </div>
          <div className={classes.infoBox}>
            <Typography variant="h6" component="h6">
              {secondsToHms(uptime)}
            </Typography>
            <Typography variant="h6" component="h6" color="textSecondary">
              Uptime
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
    flexDirection: "column"
  },
  infoBarWrapper: {
    display: "flex",
    justifyContent: "space-between"
  },
  infoBox: {
    display: "flex",
    flexDirection: "column",
    "& > h6": { fontWeight: "bolder" }
  },
  infoBar: {
    fontSize: 16,
    fontWeight: "bolder",
    display: "flex",
    alignItems: "center",
    "& > span": { marginRight: "4px" }
  }
});

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + "h" : "";
  var mDisplay = m > 0 ? m + "m" : "";
  var sDisplay = s > 0 ? s + "s" : "";

  if (h > 0 && m > 0) {
    return `${hDisplay}, ${mDisplay}`;
  }

  if (h > 0 && m === 0) {
    return `${hDisplay}`;
  }

  if (m > 0 && s > 0) {
    return `${mDisplay}, ${sDisplay}`;
  }

  if (m > 0 && s === 0) {
    return `${mDisplay}`;
  }

  return `${sDisplay}`;
}
