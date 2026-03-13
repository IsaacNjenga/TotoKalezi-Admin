import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { useCallback, useState } from "react";

function useFetchDonation() {
  const [donation, setDonation] = useState({});
  const [loading, setLoading] = useState(false);
  const openNotification = useNotification();

  const fetchDonation = useCallback(
    async (donationId) => {
      if (!donationId) return;
      setLoading(true);
      try {
        const res = await axios.get(`/fetch-donation/${donationId}`);
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
    [openNotification],
  );

  return { donation, loading, fetchDonation };
}

export default useFetchDonation;
