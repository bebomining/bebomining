import { render } from "react-dom";

import App from "./App";

if (process.env.NODE_ENV !== "development") {
  console.log = () => {};
  console.info = () => {};
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
