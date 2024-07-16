import axios from "axios";
import https from "https";

const API_BASE_URL = "https://172.31.0.139/xapi/v1";

// Create an HTTPS agent that ignores SSL certificate verification
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function getSystemStatus(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/SystemStatus`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      httpsAgent, // Use the custom HTTPS agent
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`3CX API error: ${error.response.status} - ${error.response.data}`);
    } else {
      throw new Error(`Unexpected error: ${error.message}`);
    }
  }
}

export async function getExtensions(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/SystemStatus/Pbx.SystemExtensions()`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      httpsAgent,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`3CX API error: ${error.response.status} - ${error.response.data}`);
    } else {
      throw new Error(`Unexpected error: ${error.message}`);
    }
  }
}
