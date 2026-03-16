import AlbumModel from "../models/Album.js";
import MediaModel from "../models/Media.js";

const createAlbum = async (req, res) => {
  try {
    const newAlbum = new AlbumModel({ ...req.body });
    await newAlbum.save();

    return res
      .status(201)
      .json({ success: true, message: "album created successfully" });
  } catch (error) {
    console.error("Error creating album", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const fetchAlbums = async (req, res) => {
  try {
    const albums = await AlbumModel.find({})
      .lean()
      .populate("createdBy", "username email avatar _id");

    const albumIds = albums.map((album) => album._id);

    const media = await MediaModel.find({ albumId: { $in: albumIds } })
      .populate("createdBy", "username email avatar _id")
      .lean();

    // group media by albumId
    const mediaMap = {};

    for (const item of media) {
      if (!mediaMap[item.albumId]) {
        mediaMap[item.albumId] = [];
      }
      mediaMap[item.albumId].push(item);
    }

    // attach media to albums
    const albumsWithMedia = albums.map((album) => ({
      ...album,
      media: mediaMap[album._id] || [],
    }));

    return res.status(200).json({
      success: true,
      albums: albumsWithMedia,
    });
  } catch (error) {
    console.error("Error fetching albums", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const fetchAlbum = async (req, res) => {
  try {
    const album = await AlbumModel.findById(req.params.id)
      .lean()
      .populate("createdBy", "username email avatar _id");

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    const media = await MediaModel.find({ albumId: { $in: album._id } })
      .populate("createdBy", "username email avatar _id")
      .lean();

    const mediaMap = {};

    for (const item of media) {
      if (!mediaMap[item.albumId]) {
        mediaMap[item.albumId] = [];
      }
      mediaMap[item.albumId].push(item);
    }

    const albumWithMedia = {
      ...album,
      media: mediaMap[album._id] || [],
    };

    return res.status(200).json({ success: true, album: albumWithMedia });
  } catch (error) {
    console.error("Error fetching album", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateAlbum = async (req, res) => {
  try {
    const album = await AlbumModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true },
    );
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Album updated successfully" });
  } catch (error) {
    console.error("Error updating album", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const deleteAlbum = async (req, res) => {
  try {
    const album = await AlbumModel.findByIdAndDelete(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Album deleted successfully!" });
  } catch (error) {
    console.error("Error deleting album", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createAlbum, fetchAlbums, fetchAlbum, updateAlbum, deleteAlbum };
