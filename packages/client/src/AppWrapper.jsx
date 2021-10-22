import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { AppContext } from "./contexts";
import { Miners } from "./components/Miners/Miners";
import { Workers } from "./components/Workers/Workers";
import { Wallets } from "./components/Wallets/Wallets";
import { Donation } from "./components/Donation/Donation";
import { CloudSettings } from "./components/CloudSettings/CloudSettings";

import { RouterApi } from "./components/RouterApi/RouterApi";
import { NavigationHeader } from "./components/NavigationHeader/NavigationHeader";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

export const dark = { palette: { type: "light" } };
const theme = createTheme(dark);

export class AppWrapper extends React.PureComponent {
  state = { value: null };
  static getDerivedStateFromProps({ value }) {
    return { value };
  }
  render() {
    return (
      <ThemeProvider theme={theme}>
        <AppContext.Provider value={this.state.value}>
          <Router>
            <NavigationHeader />
            <Switch>
              <Route path="/workers" component={Workers} />
              <Route path="/miners" component={Miners} />
              <Route path="/wallets" component={Wallets} />
              <Route path="/donation" component={Donation} />
              <Route path="/cloud" component={CloudSettings} />
            </Switch>
          </Router>
          <RouterApi />
        </AppContext.Provider>
      </ThemeProvider>
    );
  }
}
