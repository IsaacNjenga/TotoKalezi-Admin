import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { useCallback, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function useFetchDonation() {
  const { token,isAuthenticated } = useAuth();
  const [donation, setDonation] = useState({});
  const [loading, setLoading] = useState(false);
  const openNotification = useNotification();

  const fetchDonation = useCallback(
    async (donationId) => {
      if (!isAuthenticated) return;
      if (!donationId) return;
      setLoading(true);
      try {
        const res = await axios.get(`/fetch-donation/${donationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setDonation(res.data.donation);
        }
      } catch (error) {
        console.log("Error fetching donation", error);
        openNotification(
          "error",
          "There was an error fetching donation. Please try again later.",
          "Error",
        );
      } finally {
        setLoading(false);
      }
    },
    //eslint-disable-next-line
    [openNotification],
  );

  return { donation, loading, fetchDonation };
}

export default useFetchDonation;
