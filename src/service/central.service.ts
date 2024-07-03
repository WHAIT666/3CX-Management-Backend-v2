import CentralModel, { Central } from "../model/central.model";

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
