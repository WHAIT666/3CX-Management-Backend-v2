import { Request, Response } from "express";
import { createCentral, findCentralById, updateCentral, deleteCentral, getAllCentrals, findCentralByName } from "../service/central.service";
import { getSystemStatus, getExtensions } from "../service/3cx.service";  // Certifique-se de importar getExtensions

export async function createCentralHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const { name, ipAddress, status, fqdnUrl, usernameOrCode, password } = req.body;

  try {
    const existingCentral = await findCentralByName(name);
    if (existingCentral) {
      return res.status(409).send({ message: "Central with this name already exists" });
    }

    const central = await createCentral({ name, ipAddress, status, fqdnUrl, usernameOrCode, password, userId });
    return res.status(201).send(central);
  } catch (e) {
    return res.status(500).send(e);
  }
}

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

export async function getAllCentralsHandler(req: Request, res: Response) {
  try {
    const centrals = await getAllCentrals();
    return res.send(centrals);
  } catch (e) {
    return res.status(500).send(e);
  }
}

export async function getSystemStatusHandler(req: Request, res: Response) {
  try {
    const token = req.headers['3cxaccesstoken'];
    if (!token) {
      return res.status(401).json({ message: 'No access token found in request headers' });
    }
    const data = await getSystemStatus(token as string); // Pass the token to the service function
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch system status: ${error.message}` });
  }
}

export async function getExtensionsHandler(req: Request, res: Response) {
  try {
    const token = req.headers['3cxaccesstoken'];
    if (!token) {
      return res.status(401).json({ message: 'No access token found in request headers' });
    }
    const data = await getExtensions(token as string); // Pass the token to the service function
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch extensions: ${error.message}` });
  }
}