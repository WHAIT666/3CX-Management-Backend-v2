import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
import  sendEmail  from "../utils/mailer";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);

    await sendEmail({
      to: user.email,
      from: "test@example.com",
      subject: "Verify your email",
      text: `Verification code: ${user.verificationCode}. User ID: ${user._id}`,
    });

    return res.send("User successfully created");
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send("Account already exists");
    }

    return res.status(500).send(e);
  }
}
