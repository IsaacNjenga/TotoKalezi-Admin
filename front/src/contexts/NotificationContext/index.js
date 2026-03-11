import React, { createContext, useContext } from "react";
import { notification } from "antd";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message, title) => {
    api[type]({
      title: <span style={{ fontFamily: "DM Sans" }}>{title}</span>,
      description: <span style={{ fontFamily: "DM Sans" }}>{message}</span>,
      placement: "topRight",
      duration: 3,
    });
  };

  return (
    <NotificationContext.Provider value={openNotification}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
