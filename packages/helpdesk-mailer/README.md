# helpdesk-mailer

This is an express REST api for sending mails from the cms-spa packages from the user help and ErrorBoundary. Secured with Auth0.

## Development

You need to set these environment variables:

```bash
HELPDESK_EXPRESS_PORT=6004
NODE_ENV=development
# smtp settings
SMTP_ADMIN_TO=
SMTP_FROM=
SMTP_HOST=
SMTP_PORT=
SMTP_PW=
SMTP_USER=
# auth0
JWKS_URI=
AUTH0_AUDIENCE=
AUTH0_ISSUER=
```

```bash
npm run dev
```

### Testing

```bash
npm test
```