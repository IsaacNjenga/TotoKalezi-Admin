import WebsiteModel from "../models/Website.js";

const fetchWebsiteContent = async (req, res) => {
  try {
    const siteContent = await WebsiteModel.find();
    return res.status(200).json({ success: true, siteContent: siteContent });
  } catch (error) {
    console.error("Error fetching site content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateSite = async (req, res) => {
  try {
    const webpage = await WebsiteModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true },
    );
    if (!webpage) {
      return res.status(404).json({ message: "Webpage not found" });
    }
    return res.status(200).json({ success: true, webpage });
  } catch (error) {
    console.error("Error updating site:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { fetchWebsiteContent, updateSite };
