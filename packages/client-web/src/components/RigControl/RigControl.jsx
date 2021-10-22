import { Route, Switch } from "react-router-dom";

import { Workers } from "./../Workers/Workers";
import { MinersRoute } from "./../MinersRoute/MinersRoute";
import { Wallets } from "./../Wallets/Wallets";
import { Donation } from "./../Donation/Donation";

import { makeStyles } from "@material-ui/core/styles";
import { NavigationHeader } from "./../NavigationHeader/NavigationHeader";

export function RigControl({ match }) {
  const classes = useStyles();
  return (
    <>
      <NavigationHeader />
      <div className={classes.RigControl}>
        <Switch>
          <Route path={`${match.path}/workers`} component={Workers} />
          <Route path={`${match.path}/miners`} component={MinersRoute} exact />
          <Route path={`${match.path}/wallets`} component={Wallets} />
          <Route path={`${match.path}/donation`} component={Donation} exact />
        </Switch>
      </div>
    </>
  );
}

const useStyles = makeStyles(() => ({
  RigControl: {
    width: "100%",
    height: "100%",
    overflow: "auto",
    display: "flex",
    flexDirection: "column"
  }
}));
