import { Request, Response } from "express";
import { get } from "lodash";
import { CreateSessionInput } from "../schema/auth.schema";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
  invalidateSession,
} from "../service/auth.service";
import { findUserByEmail, findUserById } from "../service/user.service";
import { verifyJwt } from "../utils/jwt";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const message = "Invalid email or password";
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).send(message);
  }

  if (!user.verified) {
    return res.status(403).send("Please verify your email");
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.status(401).send(message);
  }

  // sign an access token
  const { accessToken, formattedExpiration: accessTokenExpiration } = signAccessToken(user);

  // sign a refresh token
  const { refreshToken, formattedExpiration: refreshTokenExpiration } = await signRefreshToken({ userId: user._id });

  // send the tokens along with expiration times
  return res.send({
    accessToken,
    accessTokenExpiration,
    refreshToken,
    refreshTokenExpiration,
  });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = get(req, "headers.x-refresh");

  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    "refreshTokenPublicKey"
  );

  if (!decoded) {
    return res.status(401).send("Could not refresh access token");
  }

  const session = await findSessionById(decoded.session);

  if (!session || !session.valid) {
    return res.status(401).send("Could not refresh access token");
  }

  const user = await findUserById(String(session.user));

  if (!user) {
    return res.status(401).send("Could not refresh access token");
  }

  const { accessToken, formattedExpiration: accessTokenExpiration } = signAccessToken(user);

  return res.send({ accessToken, accessTokenExpiration });
}

export async function logoutHandler(req: Request, res: Response) {
  const refreshToken = get(req, "headers.x-refresh");

  if (!refreshToken) {
    return res.status(400).send("No refresh token provided");
  }

  const decoded = verifyJwt<{ session: string }>(refreshToken, "refreshTokenPublicKey");

  if (!decoded) {
    return res.status(401).send("Invalid refresh token");
  }

  await invalidateSession(decoded.session);

  return res.sendStatus(200);
}
