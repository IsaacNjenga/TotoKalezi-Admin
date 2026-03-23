import axios from "axios";
import dotenv from "dotenv";
import { createDonation } from "./donationsController.js";

dotenv.config();

const url = process.env.STK_PUSH?.trim().replace(/;+$/, "");
const billAccountRef = process.env.STANBIC_BILL_REF;

const stkPush = async (req, res) => {
  try {
    const { name, email, message, amount, phone_number } = req.body;

    const payload = {
      dbsReferenceId: `donation-${Date.now()}`,
      billAccountRef: billAccountRef,
      amount: amount.toString(),
      mobileNumber: phone_number,
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${req.stanbicToken}`,
        "Content-Type": "application/json",
      },
    });

    // ✅ Check correct success condition
    if (response.data?.status === "Success") {
      await createDonation({
        amount,
        phone_number,
        transactionID: response.data.dbsReferenceId,
        name,
        email,
        message,
      });
    }

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    return res.status(500).json({
      error: "STK push failed",
    });
  }
};

export { stkPush };
