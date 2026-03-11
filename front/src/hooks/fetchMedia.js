import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { useCallback, useState } from "react";

function useFetchMedia() {
  const [media, setMedia] = useState({});
  const [loading, setLoading] = useState(false);
  const openNotification = useNotification();

  const fetchMedia = useCallback(
    async (mediaId) => {
      setLoading(true);
      try {
        const res = await axios.get(`/fetch-media/${mediaId}`);
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
    },
    [openNotification],
  );

  return { media, loading, fetchMedia };
}

export default useFetchMedia;
