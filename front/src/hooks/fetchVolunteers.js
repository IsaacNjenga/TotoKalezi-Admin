import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function useFetchAllVolunteers() {
  const { token, isAuthenticated } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const openNotification = useNotification();

  const fetchVolunteers = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    try {
      const res = await axios.get("/fetch-volunteers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setVolunteers(res.data.volunteers);
      }
    } catch (error) {
      console.log("Error fetching volunteers", error);
      openNotification(
        "error",
        "There was an error fetching volunteers. Please try again later.",
        "Error",
      );
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, openNotification]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  return {
    volunteers,
    loading,
    refresh: () => setRefreshKey((prev) => prev + 1),
  };
}

export default useFetchAllVolunteers;
