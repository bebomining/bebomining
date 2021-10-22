import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import { useFetch } from "./../../../../../hooks/useFetch";

export const CoinsCounter = ({ walletName }) => {
  const classes = useStyles();

  const { loading, data } = useFetch(`coins?walletName=${walletName}`);

  const showProgress = loading || loading === null;
  const coinsCounter = data?.results?.length;

  return (
    <div className={classes.CoinCounter}>
      <Typography
        className={classes.Typography}
        color="textSecondary"
        variant="overline"
      >
        Coins: {coinsCounter && coinsCounter}{" "}
      </Typography>
      {showProgress && (
        <CircularProgress
          size={14}
          classes={{ root: classes.CircularProgress }}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles({
  CoinCounter: { display: "flex", alignItems: "center", marginTop: "8px" },
  Typography: { fontSize: "0.85rem" }
});
