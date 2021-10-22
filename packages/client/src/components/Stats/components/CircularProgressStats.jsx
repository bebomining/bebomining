import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

export const CircularProgressStats = () => {
  const classes = useStyles();

  return (
    <div className={classes.Box}>
      <div className={classes.BoxBorder}>
        <div className={classes.loadingBar}>
          <CircularProgress />
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  loadingBar: {
    width: "100%",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  BoxBorder: {
    display: "flex",
    width: "100%",
    border: "1px solid #e8eff7",
    borderRadius: "5px",
    padding: "16px",
    justifyContent: "center",
    alignItems: "center"
  },
  Box: {
    position: "relative",
    width: "100%",
    display: "flex",
    padding: "8px 16px"
  }
});
