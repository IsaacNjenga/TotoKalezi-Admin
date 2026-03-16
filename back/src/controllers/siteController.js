const updateSite = async (req, res) => {
  try {
    const webpage = await WebpageModel.findByIdAndUpdate(
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

export { updateSite };
