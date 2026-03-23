import DonationModel from "../models/Donations.js";

const createDonation = async (
  res,
  amount,
  phone_number,
  transactionID,
  name,
  email,
  message,
) => {
  try {
    const newDonation = new DonationModel({
      amount: amount,
      phone_number: phone_number,
      transactionID: transactionID,
      name: name,
      email: email,
      message: message,
    });
    await newDonation.save();
    return res
      .status(201)
      .json({ success: true, message: "Donation saved successfully" });
  } catch (error) {
    console.error("Error creating donation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const fetchDonations = async (req, res) => {
  try {
    const donations = await DonationModel.find({});
    return res.status(200).json({ success: true, donations: donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const fetchDonation = async (req, res) => {
  try {
    const donation = await DonationModel.findById(req.params.id);
    return res.status(200).json({ success: true, donation: donation });
  } catch (error) {
    console.error("Error fetching donation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createDonation, fetchDonations, fetchDonation };
