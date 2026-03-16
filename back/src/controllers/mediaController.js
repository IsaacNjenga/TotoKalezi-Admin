import MediaModel from "../models/Media.js";

const createMedia = async (req, res) => {
  try {
    const newMedia = new MediaModel({ ...req.body });
    await newMedia.save();

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error creating media", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllMedia = async (req, res) => {
  try {
    const media = await MediaModel.find().populate(
      "createdBy",
      "username email avatar _id",
    );
    return res.status(200).json({ success: true, media });
  } catch (error) {
    console.error("Error fetching media", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMedia = async (req, res) => {
  //   const { id } = req.query;
  try {
    const media = await MediaModel.findById(req.params.id).populate(
      "createdBy",
      "username email avatar _id",
    );
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }
    return res.status(200).json({ success: true, media });
  } catch (error) {
    console.error("Error fetching media", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateMedia = async (req, res) => {
  //   const { id } = req.query;
  try {
    const media = await MediaModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true },
    );
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }
    return res.status(200).json({ success: true, media });
  } catch (error) {
    console.error("Error updating media", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMedia = async (req, res) => {
  //   const { id } = req.query;
  try {
    const media = await MediaModel.findByIdAndDelete(req.params.id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Media deleted successfully!" });
  } catch (error) {
    console.error("Error deleting media", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createMedia, getAllMedia, getMedia, updateMedia, deleteMedia };
