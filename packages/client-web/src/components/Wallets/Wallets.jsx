import React from "react";
import { Route, Switch } from "react-router-dom";

import { WalletDetails } from "./components/WalletDetails/WalletDetails";
import { AddNewWalletForm } from "./components/AddNewWalletForm/AddNewWalletForm";
import { AddNewCoinForm } from "./components/AddNewCoinForm/AddNewCoinForm";
import { WalletList } from "./components/WalletList/WalletList";

export function Wallets({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}`} component={WalletList} exact></Route>
      <Route
        path={`${match.path}/add-wallet`}
        component={AddNewWalletForm}
        exact
      />
      <Route
        path={`${match.path}/:walletName`}
        component={WalletDetails}
        exact
      />
      <Route
        path={`${match.path}/:walletName/add-coin`}
        component={AddNewCoinForm}
        exact
      />
    </Switch>
  );
}
