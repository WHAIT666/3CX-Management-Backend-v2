import { Request, Response } from "express";
import { createCentral, findCentralById, updateCentral, deleteCentral, getAllCentrals, findCentralByName } from "../service/central.service";
import { getSystemStatus } from "../service/3cx.service";

export async function createCentralHandler(req: Request, res: Response) {
  const userId = res.locals.user._id; // Assumindo que o user ID está disponível aqui
  const { name, ipAddress, status } = req.body;

  try {
    // Verifica se já existe uma central com o mesmo nome
    const existingCentral = await findCentralByName(name);
    if (existingCentral) {
      return res.status(409).send({ message: "Central with this name already exists" });
    }

    const central = await createCentral({ name, ipAddress, status, userId });
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
    const status = await getSystemStatus();
    return res.send(status);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
