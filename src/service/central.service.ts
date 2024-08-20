import https from 'https';
import CentralModel, { Central } from "../model/central.model";
import axios from "axios";
import NodeCache from "node-cache";

const tokenCache = new NodeCache({ stdTTL: 60 }); // Cache tokens for 60 seconds

// Create an HTTPS agent that ignores SSL certificate validation
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export function createCentral(input: Partial<Central>) {
  return CentralModel.create(input);
}

export function findCentralById(id: string) {
  return CentralModel.findById(id);
}

export function updateCentral(id: string, update: Partial<Central>) {
  return CentralModel.findByIdAndUpdate(id, update, { new: true });
}

export function deleteCentral(id: string) {
  return CentralModel.findByIdAndDelete(id);
}

export function getAllCentrals() {
  return CentralModel.find();
}

export function findCentralByName(name: string) {
  return CentralModel.findOne({ name });
}

export async function getAggregatedSystemStatus() {
  const centrals = await CentralModel.find({ status: 'Active' });
  let totalExtensions = 0;
  let totalTrunks = 0;
  let activeCalls = 0;

  for (const central of centrals) {
    const { ipAddress, usernameOrCode, password, securityCode } = central;

    let token = tokenCache.get(ipAddress);
    if (!token) {
      try {
        // Get new token
        const tokenResponse = await axios.post(`https://${ipAddress}/webclient/api/Login/GetAccessToken`, {
          SecurityCode: securityCode,
          Password: password,
          Username: usernameOrCode
        }, { httpsAgent });
        
        console.log("Token Response for IP", ipAddress, tokenResponse.data);

        if (tokenResponse.status !== 200) {
          throw new Error(`Failed to get token for central at ${ipAddress}`);
        }
        token = tokenResponse.data.Token.access_token;
        tokenCache.set(ipAddress, token); // Cache the token
      } catch (error) {
        console.error(`Error fetching token for central at ${ipAddress}:`, error.message);
        throw error;
      }
    }

    try {
      // Get system status using the token
      const statusResponse = await axios.get(`https://${ipAddress}/xapi/v1/SystemStatus`, {
        headers: { Authorization: `Bearer ${token}` },
        httpsAgent
      });
      const statusData = statusResponse.data;

      // Aggregate data
      totalExtensions += statusData.ExtensionsTotal;
      totalTrunks += statusData.TrunksTotal;
      activeCalls += statusData.CallsActive;
    } catch (error) {
      console.error(`Error fetching system status for central at ${ipAddress}:`, error.message);
      throw error;
    }
  }

  return { totalExtensions, totalTrunks, activeCalls };
}