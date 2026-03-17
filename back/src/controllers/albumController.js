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
      .populate("createdBy", "username email avatar _id")
      .populate("media", "_id title description url type banner createdBy");

    // const albumIds = albums.map((album) => album._id);

    // const media = await MediaModel.find({ albumId: { $in: albumIds } })
    //   .populate("createdBy", "username email avatar _id")
    //   .lean();

    // // group media by albumId
    // const mediaMap = {};

    // for (const item of media) {
    //   if (!mediaMap[item.albumId]) {
    //     mediaMap[item.albumId] = [];
    //   }
    //   mediaMap[item.albumId].push(item);
    // }

    // // attach media to albums
    // const albumsWithMedia = albums.map((album) => ({
    //   ...album,
    //   media: mediaMap[album._id] || [],
    // }));

    return res.status(200).json({
      success: true,
      albums: albums,
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
      .populate("createdBy", "username email avatar _id")
      .populate("media", "_id title description url type banner createdBy");

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // const media = await MediaModel.find({ albumId: { $in: album._id } })
    //   .populate("createdBy", "username email avatar _id")
    //   .lean();

    // const mediaMap = {};

    // for (const item of media) {
    //   if (!mediaMap[item.albumId]) {
    //     mediaMap[item.albumId] = [];
    //   }
    //   mediaMap[item.albumId].push(item);
    // }

    // const albumWithMedia = {
    //   ...album,
    //   media: mediaMap[album._id] || [],
    // };

    return res.status(200).json({ success: true, album: album });
  } catch (error) {
    console.error("Error fetching album", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addToAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;
    const { media } = req.body;

    if (!Array.isArray(media)) {
      return res.status(400).json({ message: "Media must be an array" });
    }

    if (media.length === 0) {
      return res.status(400).json({ message: "Media array cannot be empty" });
    }

    // 1. Ensure album exists (and optionally update it)
    const album = await AlbumModel.findByIdAndUpdate(
      albumId,
      {
        $addToSet: { media: { $each: media } },
      },
      { new: true },
    );

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // 2. Update all media items in ONE query
    if (media.length > 0) {
      await MediaModel.updateMany(
        { _id: { $in: media } },
        { $set: { albumId: albumId } },
      );
    }

    return res.status(200).json({
      success: true,
      message: "Media added to album successfully",
    });
  } catch (error) {
    console.error("Error adding to album", error);
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

export {
  createAlbum,
  fetchAlbums,
  fetchAlbum,
  updateAlbum,
  deleteAlbum,
  addToAlbum,
};
