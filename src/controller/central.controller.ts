import { Request, Response } from "express";
import { 
  createCentral, 
  findCentralById, 
  updateCentral, 
  deleteCentral, 
  getAllCentrals, 
  findCentralByName 
} from "../service/central.service";
import { getSystemStatus, getExtensions } from "../service/3cx.service";  // Import 3CX service functions

// Create a new central
export async function createCentralHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const { name, ipAddress, status, fqdnUrl, usernameOrCode, password } = req.body;

  try {
    const existingCentral = await findCentralByName(name);
    if (existingCentral) {
      return res.status(409).send({ message: "Central with this name already exists" });
    }

    const central = await createCentral({ 
      name, 
      ipAddress, 
      status, 
      fqdnUrl, 
      usernameOrCode, 
      password, 
      userId 
    });
    
    return res.status(201).send(central);
  } catch (e) {
    return res.status(500).send(e);
  }
}

// Get a single central by ID
export async function getCentralHandler(req: Request, res: Response) {
  const centralId = req.params.id;

  try {
    const central = await findCentralById(centralId);
    if (!central) {
      return res.status(404).send("Central not found");
    }
    return res.send(central);
  } catch (e) {
    return res.status(500).send(e);
  }
}

// Update a central by ID
export async function updateCentralHandler(req: Request, res: Response) {
  const centralId = req.params.id;
  const update = req.body;

  try {
    const central = await updateCentral(centralId, update);
    if (!central) {
      return res.status(404).send("Central not found");
    }
    return res.send(central);
  } catch (e) {
    return res.status(500).send(e);
  }
}

// Delete a central by ID
export async function deleteCentralHandler(req: Request, res: Response) {
  const centralId = req.params.id;

  try {
    const central = await deleteCentral(centralId);
    if (!central) {
      return res.status(404).send("Central not found");
    }
    return res.send({ message: "Central deleted successfully" });
  } catch (e) {
    return res.status(500).send(e);
  }
}

// Get all centrals
export async function getAllCentralsHandler(req: Request, res: Response) {
  try {
    const centrals = await getAllCentrals();
    return res.send(centrals);
  } catch (e) {
    return res.status(500).send(e);
  }
}

// Get system status for a specific central using the stored 3CX credentials
export async function getSystemStatusHandler(req: Request, res: Response) {
  const centralId = req.params.id;

  try {
    const central = await findCentralById(centralId);
    if (!central) {
      return res.status(404).send("Central not found");
    }

    const { fqdnUrl, usernameOrCode, password } = central;
    const token = await get3CXAccessToken(fqdnUrl, usernameOrCode, password); // Assume get3CXAccessToken is a function to get the 3CX access token

    const data = await getSystemStatus(token); // Pass the token to the service function
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch system status: ${error.message}` });
  }
}

// Get extensions for a specific central using the stored 3CX credentials
export async function getExtensionsHandler(req: Request, res: Response) {
  const centralId = req.params.id;

  try {
    const central = await findCentralById(centralId);
    if (!central) {
      return res.status(404).send("Central not found");
    }

    const { fqdnUrl, usernameOrCode, password } = central;
    const token = await get3CXAccessToken(fqdnUrl, usernameOrCode, password); // Assume get3CXAccessToken is a function to get the 3CX access token

    const data = await getExtensions(token); // Pass the token to the service function
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch extensions: ${error.message}` });
  }
}

// Utility function to get 3CX Access Token (to be implemented in service)
async function get3CXAccessToken(fqdnUrl: string, usernameOrCode: string, password: string) {
  // Implement the logic to obtain the 3CX access token using the provided credentials
  // This would typically involve making a request to the 3CX API's login endpoint
  // and returning the access token from the response.
  return "3cx-access-token"; // Replace with actual token retrieval logic
}
