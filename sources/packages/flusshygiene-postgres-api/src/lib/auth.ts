import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
export const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKS_URI!,
    rateLimit: true,
  }),

  // Validate the audience and the issuer.
  algorithms: ['RS256'],
  audience: process.env.AUTH0_AUDIENCE!,
  issuer: process.env.AUTH0_ISSUER!
});
