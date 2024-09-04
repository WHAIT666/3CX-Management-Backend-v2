import { Request, Response } from "express";
import { 
  createCentral, 
  findCentralById, 
  updateCentral, 
  deleteCentral, 
  getAllCentrals, 
  findCentralByName, 
  getAggregatedSystemStatus 
} from "../services/central.service";
import { 
  getSystemStatus, 
  getExtensions 
} from "../services/3cx.service";  

// Handler for creating a central
export async function createCentralHandler(req: Request, res: Response) {
  const user = res.locals.user;
  
  if (!user || !user._id) {
    console.log('Unauthorized access: User information not found.');
    return res.status(401).json({ message: "Unauthorized: User information not found." });
  }

  console.log('Creating central with user ID:', user._id);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);

  const userId = user._id;
  const { name, ipAddress, status, fqdnUrl, usernameOrCode, password } = req.body;

  try {
    const existingCentral = await findCentralByName(name);
    if (existingCentral) {
      console.log('Central with this name already exists:', name);
      return res.status(409).send({ message: "Central with this name already exists" });
    }

    const central = await createCentral({ name, ipAddress, status, fqdnUrl, usernameOrCode, password, userId });
    console.log('Central created successfully:', central);
    return res.status(201).send(central);
  } catch (e) {
    console.error('Error creating central:', e);
    return res.status(500).send(e);
  }
}

// Handler for getting a central by ID
export async function getCentralHandler(req: Request, res: Response) {
  const centralId = req.params.id;

  try {
    const central = await findCentralById(centralId);
    if (!central) {
      return res.status(404).send("Central not found");
    }
    console.log('Retrieved central by ID:', central);
    return res.send(central);
  } catch (e) {
    console.error('Error fetching central by ID:', e);
    return res.status(500).send(e);
  }
}

// Handler for updating a central
export async function updateCentralHandler(req: Request, res: Response) {
  const centralId = req.params.id;
  const update = req.body;

  try {
    const central = await updateCentral(centralId, update);
    if (!central) {
      return res.status(404).send("Central not found");
    }
    console.log('Central updated:', central);
    return res.send(central);
  } catch (e) {
    console.error('Error updating central:', e);
    return res.status(500).send(e);
  }
}

// Handler for deleting a central
export async function deleteCentralHandler(req: Request, res: Response) {
  const centralId = req.params.id;

  try {
    const central = await deleteCentral(centralId);
    if (!central) {
      return res.status(404).send("Central not found");
    }
    console.log('Central deleted:', central);
    return res.send({ message: "Central deleted successfully" });
  } catch (e) {
    console.error('Error deleting central:', e);
    return res.status(500).send(e);
  }
}

// Handler for retrieving all centrals
export async function getAllCentralsHandler(req: Request, res: Response) {
  try {
    const centrals = await getAllCentrals();
    console.log('Retrieved all centrals:', centrals);
    return res.send(centrals);
  } catch (e) {
    console.error('Error fetching all centrals:', e);
    return res.status(500).send(e);
  }
}

// Handler for getting the system status
export async function getSystemStatusHandler(req: Request, res: Response) {
  try {
    const token = req.headers['3cxaccesstoken'];
    if (!token) {
      return res.status(401).json({ message: 'No access token found in request headers' });
    }
    const data = await getSystemStatus(token as string);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch system status: ${error.message}` });
  }
}

// Handler for aggregated system status
export async function getAggregatedSystemStatusHandler(req: Request, res: Response) {
  try {
    const data = await getAggregatedSystemStatus();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch aggregated system status: ${error.message}` });
  }
}

// Handler for getting extensions
export async function getExtensionsHandler(req: Request, res: Response) {
  try {
    const token = req.headers['3cxaccesstoken'];
    if (!token) {
      return res.status(401).json({ message: 'No access token found in request headers' });
    }
    const data = await getExtensions(token as string);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch extensions: ${error.message}` });
  }
}
