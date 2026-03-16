import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import axios from "axios";
import { useAuth } from "./contexts/AuthContext";
import { Spin } from "antd";
import Auth from "./pages/Auth";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Media from "./pages/Media";
import CreateMedia from "./pages/CreateMedia";
import CreateAlbum from "./pages/CreateAlbum";
import Donations from "./pages/Donations";
import Volunteers from "./pages/Volunteers";
import EditMedia from "./pages/EditMedia";
import EditAlbum from "./pages/EditAlbum";
import Webpage from "./pages/Webpage";
import Album from "./pages/Album";

//axios.defaults.baseURL = process.env.REACT_APP_DEV_API_URL;
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

function App() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return <Spin fullscreen description="Authenticating..." size="large" />;

  return (
    <>
      {!isAuthenticated ? (
        <Auth />
      ) : (
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Navbar />
              </ProtectedRoutes>
            }
          >
            <Route index element={<Home />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/media" element={<Media />} />
            <Route path="/media/create" element={<CreateMedia />} />
            <Route path="/media/create-album" element={<CreateAlbum />} />
            <Route path="/media/edit/:id" element={<EditMedia />} />
            <Route path="/media/edit-album/:id" element={<EditAlbum />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/media/albums" element={<Album />} />
            <Route path="/webpage-editor" element={<Webpage />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

export default App;
