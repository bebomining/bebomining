import React, { useCallback, useContext } from "react";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { NotificationContext } from "./../../contexts";

export function Notification({
  severity = "error",
  message,
  title,
  action,
  children,
  identifier
}) {
  const setNotification = useContext(NotificationContext);

  const _onRemove = useCallback(() => {
    setNotification(prev => {
      const list = prev.list.filter(elm => identifier !== elm.props.identifier);
      return { ...prev, list };
    });
  }, []);

  return (
    <Alert
      action={action}
      onClose={() => _onRemove()}
      style={{ margin: "4px 0", alignItems: "center" }}
      severity={severity}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message && message}
      {children}
    </Alert>
  );
}
