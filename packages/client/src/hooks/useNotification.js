import React from "react";
import { useContext, useCallback } from "react";
import { NotificationContext } from "./../contexts";

export function useNotification() {
  const setNotification = useContext(NotificationContext);
  const addNotification = useCallback(notification => {
    const identifier = Date.now() + Math.floor(Math.random() * 100000000);
    const elm = React.cloneElement(notification, { identifier });
    setNotification(prev => ({ list: [...prev.list, elm] }));
  }, []);

  return addNotification;
}
