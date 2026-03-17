import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { useCallback, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function useFetchAlbum() {
  const { token, isAuthenticated } = useAuth();
  const [album, setAlbum] = useState({});
  const [loading, setLoading] = useState(false);
  const openNotification = useNotification();

  const fetchAlbum = useCallback(
    async (albumId) => {
      if (!isAuthenticated) return;
      if (!albumId) return;
      setLoading(true);
      try {
        const res = await axios.get(`/fetch-album/${albumId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setAlbum(res.data.album);
        }
      } catch (error) {
        console.log("Error fetching album", error);
        openNotification(
          "error",
          "There was an error fetching album. Please try again later.",
          "Error",
        );
      } finally {
        setLoading(false);
      }
    },
    //eslint-disable-next-line
    [openNotification],
  );

  return { album, loading, fetchAlbum };
}

export default useFetchAlbum;
