import { getModelForClass, prop } from "@typegoose/typegoose";

export class Central {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  ipAddress: string;

  @prop({ required: true })
  status: string;

  @prop({ required: true })
  userId: string; // Este campo é obrigatório e será preenchido pelo controlador
}

const CentralModel = getModelForClass(Central);

export default CentralModel;
