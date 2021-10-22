import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import { useFetch } from "./../../../../../hooks/useFetch";

export const WorkerCounter = ({ walletName }) => {
  const classes = useStyles();

  const { loading, data } = useFetch(`workers?walletName=${walletName}`);

  const showProgress = loading || loading === null;
  const workersCounter = data?.results?.length;

  return (
    <div className={classes.WorkerCounter}>
      <Typography
        variant="caption"
        className={classes.WorkerInfo}
        color="textSecondary"
        gutterBottom
      >
        <span>
          Used by{" "}
          {showProgress && (
            <CircularProgress
              size={14}
              classes={{ root: classes.CircularProgress }}
            />
          )}{" "}
          {workersCounter && workersCounter} Workers
        </span>
      </Typography>
    </div>
  );
};

const useStyles = makeStyles({
  WorkerCounter: { display: "flex", alignItems: "center" },
  WorkerInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});
