import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const client_id = process.env.STANBIC_CLIENT_KEY;
const client_secret = process.env.STANBIC_CLIENT_SECRET;
const token_url = process.env.AUTH_TOKEN_URL?.trim().replace(/;+$/, "");

const generateToken = async (req, res, next) => {
  if (!client_id || !client_secret) {
    return res.status(500).json({
      error: "Stanbic client credentials are not configured",
    });
  }

  if (!token_url) {
    return res.status(500).json({
      error: "Stanbic auth URL is not configured",
    });
  }

  const body = new URLSearchParams({
    client_id,
    client_secret,
    grant_type: "client_credentials",
    scope: "payments",
  });

  try {
    const response = await axios.post(token_url, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    });

    const token = response.data.access_token;

    if (!token) {
      return res.status(500).json({ error: "Token not returned from Stanbic" });
    }

    // attach token to request for next middleware/controller
    req.stanbicToken = token;

    next();
  } catch (error) {
    console.error(
      "Stanbic token error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      error: "Failed to generate Stanbic token",
    });
  }
};

export { generateToken };
