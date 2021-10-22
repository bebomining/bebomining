import React from "react";
import { Route, useRouteMatch, Switch } from "react-router-dom";
import { WorkersDetails } from "./components/WorkersDetails/WorkersDetails";
import { FormCreateWorker, FormEditWorker } from "./components/FormWorker";
import { Stats } from "./../Stats/Stats";

export function Workers() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}`} component={WorkersDetails} exact />
      <Route path={`${match.path}/add`} component={FormCreateWorker} exact />
      <Route
        path={`${match.path}/edit/:workerId`}
        component={FormEditWorker}
        exact
      />
      <Route path={`${match.path}/stats/:workerId`} component={Stats} exact />
    </Switch>
  );
}
