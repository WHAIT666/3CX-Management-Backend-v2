import { getModelForClass, prop } from "@typegoose/typegoose";

export class Central {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  ipAddress: string;

  @prop({ required: true })
  status: string;

  @prop({ required: true })
  userId: string;

  // New fields for 3CX credentials
  @prop({ required: true })
  fqdnUrl: string;

  @prop({ required: true })
  usernameOrCode: string;

  @prop({ required: true })
  password: string; // Ideally, this should be encrypted
}

const CentralModel = getModelForClass(Central);

export default CentralModel;
