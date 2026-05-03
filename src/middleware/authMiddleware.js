import { verify } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// Cognito config
const client = jwksClient({
  jwksUri: `https://cognito-idp.<REGION>.amazonaws.com/<USER_POOL_ID>/.well-known/jwks.json`
});

// Get signing key from Cognito
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    verify(token, getKey, {
      issuer: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_4zqOeAlcz`
    }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      //new user identity
      req.user = {
        sub: decoded.sub,
        email: decoded.email
      };

      next();
    });

  } catch (err) {
    return res.status(401).json({ message: 'Auth failed' });
  }
}

export default authMiddleware;