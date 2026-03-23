import axios from "axios";
import dotenv from "dotenv";
import { createDonation } from "./donationsController";

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

    res.json(response.data);

    if (response.status === "Success") {
      const result = await createDonation(
        res,
        amount,
        phone_number,
        response.data.dbsReferenceId,
        name,
        email,
        message,
      );
      console.log(result);
      return result;
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      error: "STK push failed",
    });
  }
};

export { stkPush };
