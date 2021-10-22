import React from "react";
import Button from "@material-ui/core/Button";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import Typography from "@material-ui/core/Typography";

export class ErrorBoundary extends React.PureComponent {
  state = { hasError: false, errors: [] };

  static getDerivedStateFromError = () => {
    return { hasError: true };
  };

  _relaunchApp = () => {
    window.electron.send("relaunch");
  };

  render() {
    const { hasError } = this.state;

    if (hasError) {
      return (
        <div style={styles.root}>
          <WarningRoundedIcon
            color="secondary"
            style={{ fontSize: 60, marginBottom: "12px" }}
          />
          <Typography
            variant="h4"
            component="h4"
            color="textSecondary"
            gutterBottom
          >
            Oops!
          </Typography>
          <Typography
            variant="h5"
            component="h5"
            color="textSecondary"
            gutterBottom
          >
            Something went wrong.
          </Typography>
          <Typography
            variant="h5"
            component="h5"
            color="textSecondary"
            gutterBottom
          >
            Please restart the application!
          </Typography>
          <Button
            style={{ marginTop: "24px" }}
            onClick={this._relaunchApp}
            color="primary"
            variant="contained"
            autoFocus
          >
            Restart
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  root: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  table: { flex: 1, border: "1px solid #e8eff7", borderRadius: "5px" },
  TableHead: {
    fontWeight: "bold",
    textTransform: "uppercase"
  }
};
