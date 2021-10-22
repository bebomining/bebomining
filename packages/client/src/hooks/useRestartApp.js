import { useState, useEffect } from "react";

let restarted = false;
export function useRestartApp() {
  const [isRestarting, setisRestarting] = useState(() => false);

  useEffect(() => {
    if (isRestarting && !restarted) {
      restarted = true;
      window.electron.send("relaunch");
    }
  }, [isRestarting]);

  return () => setisRestarting(true);
}
