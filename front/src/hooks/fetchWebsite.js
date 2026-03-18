import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext/index.js";

function useFetchWebsite() {
  const { token, isAuthenticated } = useAuth();
  const [website, setWebsite] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const openNotification = useNotification();

  const fetchWebsite = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    try {
      const res = await axios.get("/website-pages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setWebsite(res.data.siteContent);
      }
    } catch (error) {
      console.log("Error fetching website content", error);
      openNotification(
        "error",
        "There was an error fetching website content. Please try again later.",
        "Error",
      );
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, openNotification]);

  useEffect(() => {
    fetchWebsite();
  }, [fetchWebsite]);

  return {
    website,
    loading,
    refresh: () => setRefreshKey((prev) => prev + 1),
  };
}

export default useFetchWebsite;
