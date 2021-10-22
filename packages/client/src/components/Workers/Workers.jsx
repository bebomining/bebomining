import React from "react";
import { Route, Switch } from "react-router-dom";
import { WorkersDetails } from "./components/WorkersDetails/WorkersDetails";
import { FormCreateWorker, FormEditWorker } from "./components/FormWorker";
import { Stats } from "./../Stats/Stats";

export function Workers({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}`} component={WorkersDetails} exact></Route>
      <Route
        path={`${match.path}/add-worker`}
        component={FormCreateWorker}
        exact
      />
      <Route
        path={`${match.path}/edit-worker/:workerId`}
        component={FormEditWorker}
        exact
      />
      <Route path={`${match.path}/stats/:workerId`} component={Stats} exact />
    </Switch>
  );
}
