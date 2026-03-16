import express from "express";
import {
  ChangePassword,
  checkEmailExists,
  checkUserExists,
  Login,
  refreshMyToken,
  Register,
} from "../controllers/authController.js";
import {
  createMedia,
  deleteMedia,
  getAllMedia,
  getMedia,
  updateMedia,
} from "../controllers/mediaController.js";
import protectRoute from "../middleware/auth.middleware.js";
import {
  createVolunteer,
  fetchVolunteers,
  updateVolunteer,
} from "../controllers/volunteerController.js";
import {
  fetchDonations,
  createDonation,
  fetchDonation,
} from "../controllers/donationsController.js";
import {
  createAlbum,
  deleteAlbum,
  fetchAlbum,
  fetchAlbumMedia,
  fetchAlbums,
  updateAlbum,
} from "../controllers/albumController.js";

const router = express.Router();

//auth routes
router.post("/sign-up", Register);
router.post("/sign-in", Login);
router.post("/change-password", ChangePassword);
router.post("/refresh-token", refreshMyToken);
router.get("/check-email-exists", checkEmailExists);
router.get("/check-username-exists", checkUserExists);

//media routes
router.post("/create-media", protectRoute, createMedia);
router.get("/fetch-all-media", getAllMedia);
router.get("/fetch-media/:id", getMedia);
router.put("/update-media/:id", protectRoute, updateMedia);
router.delete("/delete-media/:id", protectRoute, deleteMedia);

//volunteer routes
router.post("/create-volunteer", createVolunteer);
router.get("/fetch-volunteers", protectRoute, fetchVolunteers);
router.post("/volunteers/mark-record/:id", protectRoute, updateVolunteer);

//donation routes
router.post("/create-donation", createDonation);
router.get("/fetch-donations", protectRoute, fetchDonations);
router.get("/fetch-donation/:id", protectRoute, fetchDonation);

//album routes
router.post("/create-album", protectRoute, createAlbum);
router.get("/fetch-all-albums", protectRoute, fetchAlbums);
router.get("/fetch-album/:id", protectRoute, fetchAlbum);
router.get("/fetch-album-media", fetchAlbumMedia);
router.put("/update-album/:id", protectRoute, updateAlbum);
router.delete("/delete-album/:id", protectRoute, deleteAlbum);

export { router as Router };
