import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext/index.js";

function useFetchAllDonations() {
  const { token,isAuthenticated } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const openNotification = useNotification();

  const fetchDonation = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await axios.get("/fetch-donations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setDonations(res.data.donations);
      }
    } catch (error) {
      console.log("Error fetching donations", error);
      openNotification(
        "error",
        "There was an error fetching donations. Please try again later.",
        "Error",
      );
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, openNotification]);

  useEffect(() => {
    fetchDonation();
  }, [fetchDonation]);

  return {
    donations,
    loading,
    refresh: () => setRefreshKey((prev) => prev + 1),
  };
}

export default useFetchAllDonations;
