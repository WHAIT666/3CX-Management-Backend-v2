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
  let aggregatedStatus = {
    FQDN: '',
    Version: '',
    Activated: false,
    MaxSimCalls: 0,
    MaxSimMeetingParticipants: 0,
    ExtensionsRegistered: 0,
    ExtensionsTotal: 0,
    TrunksRegistered: 0,
    TrunksTotal: 0,
    CallsActive: 0,
    BackupScheduled: false,
    AutoUpdateEnabled: false,
  };

  for (const central of centrals) {
    const { ipAddress, usernameOrCode, password, securityCode } = central;

    let token = tokenCache.get(ipAddress);
    if (!token) {
      try {
        const tokenResponse = await axios.post(`https://${ipAddress}/webclient/api/Login/GetAccessToken`, {
          SecurityCode: securityCode,
          Password: password,
          Username: usernameOrCode
        }, { httpsAgent });
        
        if (tokenResponse.status !== 200) {
          throw new Error(`Failed to get token for central at ${ipAddress}`);
        }
        token = tokenResponse.data.Token.access_token;
        tokenCache.set(ipAddress, token); // Cache the token
      } catch (error) {
        console.error(`Error fetching token for central at ${ipAddress}:`, error.message);
        continue; // Skip to the next central instead of throwing
      }
    }

    try {
      const statusResponse = await axios.get(`https://${ipAddress}/xapi/v1/SystemStatus`, {
        headers: { Authorization: `Bearer ${token}` },
        httpsAgent
      });
      const statusData = statusResponse.data;

      // Aggregate data
      aggregatedStatus.FQDN = statusData.FQDN;
      aggregatedStatus.Version = statusData.Version;
      aggregatedStatus.Activated = statusData.Activated;
      aggregatedStatus.MaxSimCalls += statusData.MaxSimCalls;
      aggregatedStatus.MaxSimMeetingParticipants += statusData.MaxSimMeetingParticipants;
      aggregatedStatus.ExtensionsRegistered += statusData.ExtensionsRegistered;
      aggregatedStatus.ExtensionsTotal += statusData.ExtensionsTotal;
      aggregatedStatus.TrunksRegistered += statusData.TrunksRegistered;
      aggregatedStatus.TrunksTotal += statusData.TrunksTotal;
      aggregatedStatus.CallsActive += statusData.CallsActive;
      aggregatedStatus.BackupScheduled = statusData.BackupScheduled;
      aggregatedStatus.AutoUpdateEnabled = statusData.AutoUpdateEnabled;
      
    } catch (error) {
      console.error(`Error fetching system status for central at ${ipAddress}:`, error.message);
      continue; // Skip to the next central instead of throwing
    }
  }

  return aggregatedStatus;
}