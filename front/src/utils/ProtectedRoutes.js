import React, { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";
import Auth from "../pages/Auth";
import { useNotification } from "../contexts/NotificationContext";

function ProtectedRoutes({ children }) {
  const { isAuthenticated, logout, refreshToken } = useAuth();
  // ⬆️ ensure `refreshToken` exists in your AuthContext (it should renew token)
  const openNotification = useNotification();
  const token = localStorage.getItem("token");
  const alertShownRef = useRef(false); // prevents multiple alerts

  useEffect(() => {
    if (!token || !isAuthenticated) return;

    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const now = Date.now();
      const timeLeft = expiryTime - now;

      // Helper to log out gracefully
      const handleLogout = (message) => {
        logout();
        openNotification("warning", message, "Session Expired");
      };

      if (timeLeft <= 0) {
        handleLogout("Your session has expired. Please log in again.");
        return;
      }

      // If less than 30 seconds remain, show warning modal
      if (timeLeft <= 30000 && !alertShownRef.current) {
        alertShownRef.current = true;

        let remaining = Math.floor(timeLeft / 1000);
        let timerInterval;

        Swal.fire({
          title: "Session Expiring Soon",
          html: `Your session will expire in <b>${remaining}</b> seconds.<br/>Do you want to stay logged in?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Stay Logged In",
          cancelButtonText: "Log Out",
          allowOutsideClick: false,
          timer: timeLeft,
          timerProgressBar: true,
          didOpen: () => {
            const b = Swal.getHtmlContainer().querySelector("b");
            timerInterval = setInterval(() => {
              remaining -= 1;
              if (remaining <= 0) {
                Swal.close();
                handleLogout("Your session has expired. Please log in again.");
              }
              b.textContent = remaining;
            }, 1000);
          },
          willClose: () => clearInterval(timerInterval),
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const newToken = await refreshToken(); // 👈 implement this in AuthContext
              if (newToken) {
                openNotification(
                  "success",
                  "Your session has been renewed successfully!",
                  "Session Extended",
                );
                alertShownRef.current = false;
              } else {
                handleLogout("Failed to renew session. Please log in again.");
              }
            } catch (err) {
              handleLogout("Error renewing session. Please log in again.");
            }
          } else {
            handleLogout("You have been logged out.");
          }
        });
      } else {
        // Schedule check again before expiry
        const timer = setTimeout(() => {
          handleLogout("Your session has expired. Please log in again.");
        }, timeLeft);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
      openNotification(
        "warning",
        "Your session is not authenticated. Please log in again.",
        "Session Error!",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAuthenticated, logout, openNotification]);

  if (!isAuthenticated || !token) {
    return <Auth />; // Redirect to login
  }

  return children;
}

export default ProtectedRoutes;
