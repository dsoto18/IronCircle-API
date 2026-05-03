import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { config } from "../config";

const client = jwksClient({
  jwksUri: `https://cognito-idp.${config.region}.amazonaws.com/${config.userPooolId}/.well-known/jwks.json`
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

// extend Express Request type
export interface AuthRequest extends Request {
  user?: {
    sub: string;
    email?: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(
    token,
    getKey,
    {
      issuer: `https://cognito-idp.${config.region}.amazonaws.com/${config.userPooolId}`
    },
    (err, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = {
        sub: decoded.sub,
        email: decoded.email
      };

      next();
    }
  );
}