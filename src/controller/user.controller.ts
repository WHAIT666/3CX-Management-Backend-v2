// user.controller.ts

import { Request, Response } from "express";
import { nanoid } from 'nanoid';
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
} from "../service/user.service";
import log from "../utils/logger";
import sendEmail from "../utils/mailer";
import { Roles } from "../utils/roles";
import { get3CXUsers, delete3CXUser, create3CXUser } from '../service/3cx.service';

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser({ ...body, role: Roles.User });

    const verificationLink = `http://localhost:5173/verify-email?id=${user._id}&code=${user.verificationCode}`;

    await sendEmail({
      to: user.email,
      from: "andresantosuwu@gmail.com",
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif; color: #FFFFFF; background-color: #1A1A1A; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #2C2C2C; padding: 20px; border-radius: 8px;">
            <div style="text-align: center;">
              <img src="https://techbase.com.pt/wp-content/uploads/2020/03/cropped-icone_cor1-300x300.png" alt="Company Logo" style="width: 100px; height: auto;">
            </div>
            <h2 style="color: #FFA500; text-align: center;">VERIFY YOUR EMAIL</h2>
            <p style="color: #FFFFFF;">Hello ${user.firstName} ${user.lastName},</p>
            <p style="color: #FFFFFF;">Thank you for registering. Please click the button below to verify your email address:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${verificationLink}" style="background-color: #FFA500; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">VERIFY EMAIL</a>
            </div>
            <p style="color: #FFFFFF;">If you did not register, please ignore this email.</p>
            <p style="color: #FFFFFF;">Thank you,<br>Techbase Team</p>
            <div style="text-align: center; margin-top: 20px;">
              <img src="https://techbase.pt/wp-content/uploads/2020/03/cropped-logo_assinatura_cor1.png" alt="Company Logo" style="width: 100px; height: auto;">
            </div>
          </div>
        </div>
      `,
    });

    return res.send("User successfully created");
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send("Account already exists");
    }

    return res.status(500).send(e);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  const user = await findUserById(id);

  if (!user) {
    return res.send("Could not verify user");
  }

  if (user.verified) {
    return res.send("User is already verified");
  }

  if (user.verificationCode === verificationCode) {
    user.verified = true;
    await user.save();
    return res.send("User successfully verified");
  }

  return res.send("Could not verify user");
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  const message = "If a user with that email is registered, you will receive a password reset email";

  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    log.debug(`User with email ${email} does not exist`);
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("User is not verified");
  }

  const passwordResetCode = nanoid();
  user.passwordResetCode = passwordResetCode;
  user.passwordResetExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  await user.save();

  const resetLink = `http://localhost:5173/reset-password?code=${passwordResetCode}&id=${user._id}`;

  await sendEmail({
    to: user.email,
    from: "andresantosuwu@gmail.com",
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; color: #FFFFFF; background-color: #1A1A1A; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #2C2C2C; padding: 20px; border-radius: 8px;">
          <div style="text-align: center;">
            <img src="https://techbase.com.pt/wp-content/uploads/2020/03/cropped-icone_cor1-300x300.png" alt="Company Logo" style="width: 100px; height: auto;">
          </div>
          <h2 style="color: #FFA500; text-align: center;">FORGOT PASSWORD</h2>
          <p style="color: #FFFFFF;">Hello ${user.firstName} ${user.lastName},</p>
          <p style="color: #FFFFFF;">A reset password request has been made for the account associated with this email address. If you did not request this, please ignore this email.</p>
          <p style="color: #FFFFFF;">If you initiated this request, please click the button below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #FFA500; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">RESET PASSWORD</a>
          </div>
          <p style="color: #FFFFFF;">Thank you,<br>Techbase Team</p>
          <div style="text-align: center; margin-top: 20px;">
            <img src="https://techbase.pt/wp-content/uploads/2020/03/cropped-logo_assinatura_cor1.png" alt="Company Logo" style="width: 100px; height: auto;">
          </div>
        </div>
      </div>
    `,
  });

  log.debug(`Password reset email sent to ${email}`);

  return res.send(message);
}

// user.controller.ts
import { Request, Response } from "express";
import { ResetPasswordInput } from "../schema/user.schema";
import { findUserById } from "../service/user.service";
import log from "../utils/logger";

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  const user = await findUserById(id);

  if (!user) {
    log.debug(`User with id ${id} does not exist`);
    return res.status(400).send("Could not reset user password");
  }

  if (!user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
    log.debug(`Invalid password reset code for user ${id}`);
    return res.status(400).send("Invalid password reset code");
  }

  if (user.passwordResetExpiry! < new Date()) {
    log.debug(`Password reset code expired for user ${id}`);
    return res.status(400).send("Password reset code expired");
  }

  user.passwordResetCode = null;
  user.passwordResetExpiry = null;
  user.password = password;
  await user.save();

  return res.send("Successfully updated password");
}


export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
}

export async function getAllUsersHandler(req: Request, res: Response) {
  const users = await getAllUsers(); // Ensure this function is implemented in the service layer
  return res.send(users);
}

export async function getUsersFrom3CXHandler(req: Request, res: Response) {
  try {
    const token = req.headers['3cxaccesstoken'] as string;
    if (!token) {
      return res.status(401).json({ message: 'No access token found in request headers' });
    }
    const users = await get3CXUsers(token);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch users from 3CX: ${error.message}` });
  }
}

export async function delete3CXUserHandler(req: Request, res: Response) {
  try {
    const token = req.headers['3cxaccesstoken'] as string;
    const { id } = req.params;
    if (!token) {
      return res.status(401).json({ message: 'No access token found in request headers' });
    }
    await delete3CXUser(token, id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: `Failed to delete user from 3CX: ${error.message}` });
  }
}

