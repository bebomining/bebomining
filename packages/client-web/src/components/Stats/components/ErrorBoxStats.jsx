import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

export const ErrorBoxStats = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.Box}>
      <div className={classes.BoxBorder}>
        <Typography variant="h5" component="h5">
          {children}
        </Typography>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
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
