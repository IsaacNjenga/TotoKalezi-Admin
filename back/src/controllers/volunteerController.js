import VolunteerModel from "../models/Volunteers.js";

const createVolunteer = async (req, res) => {
  try {
    const newVolunteer = new VolunteerModel({ ...req.body });
    await newVolunteer.save();
    return res.status(201).json({
      message: "Volunteer created successfully",
    });
  } catch (error) {
    console.log("Error in creating volunteer:", error);
    return res.status(500).json({ message: error.message });
  }
};

const fetchVolunteers = async (req, res) => {
  try {
    const volunteers = await VolunteerModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, volunteers: volunteers });
  } catch (error) {
    console.log("Error in fetching volunteers:", error);
    return res.status(500).json({ message: error.message });
  }
};

export { createVolunteer, fetchVolunteers };
