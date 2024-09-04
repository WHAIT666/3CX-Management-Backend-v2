import https from 'https';
import CentralModel, { Central } from "../models/central.model";
import axios from "axios";
import NodeCache from "node-cache";

const tokenCache = new NodeCache({ stdTTL: 60 }); // Cache tokens for 60 seconds

// Create an HTTPS agent that ignores SSL certificate validation
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Create a new central
export async function createCentral(input: Partial<Central>) {
  console.log('Creating central in DB with data:', input); 
  try {
    const central = await CentralModel.create(input);
    console.log('Central created in DB:', central);
    return central;
  } catch (error) {
    console.error('Error creating central in DB:', error.message);
    throw error;
  }
}

// Find a central by ID
export async function findCentralById(id: string) {
  try {
    const central = await CentralModel.findById(id);
    console.log('Central found by ID:', central);
    return central;
  } catch (error) {
    console.error('Error finding central by ID:', error.message);
    throw error;
  }
}

// Update a central by ID
export async function updateCentral(id: string, update: Partial<Central>) {
  console.log('Updating central with ID:', id);
  console.log('Update data:', update);
  try {
    const central = await CentralModel.findByIdAndUpdate(id, update, { new: true });
    console.log('Central updated:', central);
    return central;
  } catch (error) {
    console.error('Error updating central:', error.message);
    throw error;
  }
}

// Delete a central by ID
export async function deleteCentral(id: string) {
  console.log('Deleting central with ID:', id);
  try {
    const central = await CentralModel.findByIdAndDelete(id);
    console.log('Central deleted:', central);
    return central;
  } catch (error) {
    console.error('Error deleting central:', error.message);
    throw error;
  }
}

// Get all centrals
export async function getAllCentrals() {
  try {
    const centrals = await CentralModel.find();
    console.log('Retrieved all centrals:', centrals);
    return centrals;
  } catch (error) {
    console.error('Error retrieving centrals:', error.message);
    throw error;
  }
}

// Find a central by name
export async function findCentralByName(name: string) {
  try {
    const central = await CentralModel.findOne({ name });
    console.log('Central found by name:', central);
    return central;
  } catch (error) {
    console.error('Error finding central by name:', error.message);
    throw error;
  }
}

// Get aggregated system status
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
