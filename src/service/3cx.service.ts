import axios from "axios";
import https from "https";

const API_BASE_URL = "https://172.31.0.139/xapi/v1";

// Create an HTTPS agent that ignores SSL certificate verification
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function getSystemStatus() {
  try {
    const response = await axios.get(`${API_BASE_URL}/SystemStatus`, {
      headers: {
        Authorization: `Bearer ${process.env.THREE_CX_API_KEY}`,
        Accept: "application/json",
      },
      httpsAgent, // Use the custom HTTPS agent
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch system status: ${error.message}`);
  }
}
