import { DocumentType } from "@typegoose/typegoose";
import { omit } from "lodash";
import SessionModel from "../model/session.model";
import { privateFields, User } from "../model/user.model";
import { signJwt } from "../utils/jwt";

// Utility function for formatting expiration time
function formatExpirationTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id).where("valid").equals(true);
}

export async function invalidateSession(sessionId: string) {
  return SessionModel.updateOne({ _id: sessionId }, { valid: false });
}

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({
    userId,
  });

  const expiresIn = '1y';
  const refreshToken = signJwt(
    {
      session: session._id,
    },
    "refreshTokenPrivateKey",
    {
      expiresIn,
    }
  );

  const expirationInSeconds = 365 * 24 * 60 * 60;

  return {
    refreshToken,
    formattedExpiration: formatExpirationTime(expirationInSeconds),
  };
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields);

  const expiresIn = '60m';
  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn,
  });

  const expirationInSeconds = 60 * 60;

  return {
    accessToken,
    formattedExpiration: formatExpirationTime(expirationInSeconds),
  };
}
