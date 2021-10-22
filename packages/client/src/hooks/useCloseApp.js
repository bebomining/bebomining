import { useState, useEffect } from "react";

let closed = false;
export function useCloseApp() {
  const [isClose, setIsClose] = useState(() => false);

  useEffect(() => {
    if (isClose && !closed) {
      closed = true;
      window.electron.send("onCloseApp");
    }
  }, [isClose]);

  const closeApp = () => setIsClose(true);

  return closeApp;
}
