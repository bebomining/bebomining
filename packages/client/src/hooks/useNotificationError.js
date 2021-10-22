import React, { useEffect } from "react";
import { useContext, useCallback } from "react";
import { NotificationContext } from "./../contexts";
import { Notification } from "./../components/Notification/Notification";

export function useNotificationError(error) {
  const setNotification = useContext(NotificationContext);
  const addNotification = useCallback(notification => {
    const identifier = Date.now() + Math.floor(Math.random() * 100000000);
    const elm = React.cloneElement(notification, { identifier });
    setNotification(prev => ({ list: [...prev.list, elm] }));
  }, []);

  const setError = error =>
    addNotification(<Notification severity="error" message={error.message} />);

  useEffect(() => {
    if (error) {
      setError(error);
    }
  }, [error]);

  return { setError };
}
