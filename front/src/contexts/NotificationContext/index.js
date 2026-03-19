import React, { createContext, useContext } from "react";
import { notification } from "antd";
import { useAuth } from "../AuthContext";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message, title) => {
    if (isAuthenticated) {
      api[type]({
        title: <span style={{ fontFamily: "DM Sans" }}>{title}</span>,
        description: <span style={{ fontFamily: "DM Sans" }}>{message}</span>,
        placement: "topRight",
        duration: 2,
      });
    }
  };

  return (
    <NotificationContext.Provider value={openNotification}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
