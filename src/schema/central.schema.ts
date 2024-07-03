import { object, string, TypeOf } from "zod";

export const createCentralSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    ipAddress: string({
      required_error: "IP Address is required",
    }),
    status: string({
      required_error: "Status is required",
    }),
  }),
});

export const updateCentralSchema = object({
  body: object({
    name: string().optional(),
    ipAddress: string().optional(),
    status: string().optional(),
  }),
});

export type CreateCentralInput = TypeOf<typeof createCentralSchema>["body"];
export type UpdateCentralInput = TypeOf<typeof updateCentralSchema>["body"];
