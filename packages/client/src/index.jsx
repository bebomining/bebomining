import React from "react";
import { render } from "react-dom";

import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";

if (process.env.NODE_ENV !== "development") {
  console.log = () => {};
  console.info = () => {};
}

const rootElement = document.getElementById("root");
render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  rootElement
);
