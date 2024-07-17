// 3cx.service.ts

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

export async function get3CXUsers(token: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Users?%24top=50&%24skip=0&%24filter=not%20startsWith(Number%2C%27HD%27)&%24count=true&%24orderby=Number&%24select=IsRegistered%2CCurrentProfileName%2CDisplayName%2CId%2CEmailAddress%2CNumber%2CTags%2CRequire2FA&%24expand=Groups(%24select%3DGroupId%2CName%2CRights%3B%24filter%3Dnot%20startsWith(Name%2C%27___FAVORITES___%27)%3B%24expand%3DRights(%24select%3DRoleName))%2CPhones(%24select%3DMacAddress%2CName%2CSettings(%24select%3DIsSBC%2CProvisionType))`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        httpsAgent,
      }
    );
    return response.data.value;
  } catch (error) {
    console.error('Error fetching users from 3CX:', error);
    throw error;
  }
}

export async function delete3CXUser(token: string, userId: string) {
  try {
    await axios.delete(`${API_BASE_URL}/Users(${userId})`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent,
    });
  } catch (error) {
    console.error('Error deleting user from 3CX:', error);
    throw error;
  }
}


