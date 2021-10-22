import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SettingsIcon from "@material-ui/icons/Settings";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FileCopyIcon from "@material-ui/icons/FileCopy";

export const Header = ({ worker, meta }) => {
  const classes = useStyles();
  const { coinName, address } = worker;
  const { statsUrl } = meta;
  const coinSrc = `icons/${coinName}.png`;
  const copyAddress = () => navigator.clipboard.writeText(address);

  const dual = address.split(".");
  const addressToShow = dual.length > 1 ? reduceAddress(dual) : address;

  return (
    <div className={classes.root}>
      <div className={classes.Wrapper}>
        <div className={classes.infoBarWrapper}>
          <img src={coinSrc} alt={coinName} className={classes.coinSrc} />
          <Typography variant="h6" component="h6" className={classes.infoBar}>
            {coinName}:{addressToShow}
          </Typography>
          <IconButton
            title="Copy Address"
            className={classes.CopyButton}
            size="small"
            onClick={copyAddress}
            aria-label="copy address"
          >
            <FileCopyIcon />
          </IconButton>
        </div>

        <Button
          className={classes.ButtonSettings}
          size="small"
          color="primary"
          variant="contained"
          title="Pool Settings"
          onClick={() => window.open(statsUrl, "_blank")}
          startIcon={<SettingsIcon />}
        >
          <span className="btn-label">Settings</span>
        </Button>
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
  ButtonSettings: {
    ["@media (max-width:900px)"]: {
      "& .btn-label": { display: "none" },
      "& .MuiButton-startIcon": { margin: "0" },
      padding: "8px",
      minWidth: "initial"
    }
  },
  Wrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: "1px solid #e8eff7",
    borderRadius: "5px",
    padding: "16px",
    justifyContent: "space-between"
  },
  CopyButton: { marginLeft: "16px", padding: "4px" },
  coinSrc: { width: "32px", height: "auto" },
  infoBarWrapper: {
    display: "flex",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  infoBar: {
    textTransform: "uppercase",
    marginLeft: "16px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
});

function reduceAddress(addresses) {
  return addresses
    .map(address => `${address.slice(0, 10)}...${address.slice(-10)}`)
    .join(".");
}
