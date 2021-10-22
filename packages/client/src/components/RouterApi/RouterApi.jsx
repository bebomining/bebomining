import { useEffect } from "react";
import { useAppContext } from "./../../hooks/useAppContext";
import { router } from "./utils/router";

export function RouterApi() {
  const { bus, socket, apiServer } = useAppContext();

  useEffect(() => {
    bus.on("route.event", async event => {
      const { namespace } = event;
      console.log({ type: "route.event", namespace });
      const eventResult = await router(event, apiServer);
      console.log({ type: "eventResult", eventResult });
      try {
        socket.sendCommand(eventResult);
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  return null;
}
