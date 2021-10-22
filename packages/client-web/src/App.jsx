import React, { useState, memo } from "react";

import { NotificationContext } from "./contexts";
import AppWrapper from "./AppWrapper";
import { NotificationsPortal } from "./components/NotificationsPortal/NotificationsPortal";

import "./styles.css";

function App() {
  const [notification, setNotification] = useState(() => ({ list: [] }));

  return (
    <div className="App">
      <NotificationContext.Provider value={setNotification}>
        <AppWrapper />
        <NotificationsPortal selector="#notifications">
          {notification.list.map((elm, index) => {
            const identifier = `${Date.now()}${index}`;
            return <React.Fragment key={identifier}>{elm}</React.Fragment>;
          })}
        </NotificationsPortal>
      </NotificationContext.Provider>
    </div>
  );
}

export default memo(App);
