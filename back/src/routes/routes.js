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

export { router as Router };
