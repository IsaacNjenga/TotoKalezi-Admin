import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { useCallback, useEffect, useState } from "react";

function useFetchAllMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const openNotification = useNotification();

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/fetch-all-media");
      if (res.data.success) {
        setMedia(res.data.media);
      }
    } catch (error) {
      console.log("Error fetching media", error);
      openNotification(
        "error",
        "There was an error fetching media. Please try again later.",
        "Error",
      );
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, openNotification]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { media, loading, refresh: () => setRefreshKey((prev) => prev + 1) };
}

export default useFetchAllMedia;
