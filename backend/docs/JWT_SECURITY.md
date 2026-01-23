# JWT Secret Security Guide

## Overview
This document outlines the security practices for JWT secret management in the Student Finance Dashboard application.

## Current Implementation

### Secure Configuration
- **Location**: `backend/src/config/jwt.ts`
- **Features**:
  - 256-bit minimum secret length validation
  - Production environment enforcement
  - Development warnings for weak secrets
  - Issuer/audience claims for additional validation
  - Auto-generation of secrets in development if not provided

### Validation Rules
1. **Production**: Secrets MUST be at least 64 characters (256-bit)
2. **Development**: Warns if secrets are weak or missing
3. **Algorithm**: HS256 (HMAC SHA-256)
4. **Claims**: Includes issuer (`uniflow-api`) and audience (`uniflow-client`)

## Generating Secure Secrets

### Method 1: Using the Helper Script (Recommended)
```bash
cd backend
node scripts/generate-secrets.js
```

### Method 2: Using Node.js Directly
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Method 3: Using OpenSSL
```bash
openssl rand -hex 64
```

## Secret Rotation Process

### When to Rotate
- Every 90 days (recommended)
- After a security incident
- When a team member with access leaves
- If secrets are accidentally exposed

### Rotation Steps
1. **Generate New Secrets**
   ```bash
   node scripts/generate-secrets.js
   ```

2. **Update Environment Variables**
   - Production: Update in your secrets manager
   - Development: Update `.env` file

3. **Deploy Changes**
   - Rolling deployment to avoid downtime
   - Old tokens remain valid during transition

4. **Blacklist Old Tokens (Optional)**
   - If rotating due to security incident
   - Invalidate all existing refresh tokens

5. **Monitor**
   - Watch for increased 401 errors
   - Users will need to re-login

## Environment-Specific Configuration

### Development
- Stored in `.env` file (gitignored)
- Can use generated secrets or provided ones
- Warnings displayed if secrets are weak

### Production
Secrets should NEVER be stored in code or version control. Use one of:

#### AWS
- **AWS Secrets Manager**: For sensitive secrets
- **AWS Parameter Store**: For configuration
- **Setup**:
  ```bash
  aws secretsmanager create-secret \
    --name uniflow/jwt-secret \
    --secret-string "your-64-char-secret"
  ```

#### Google Cloud Platform
- **Google Secret Manager**
- **Setup**:
  ```bash
  echo -n "your-64-char-secret" | \
    gcloud secrets create jwt-secret --data-file=-
  ```

#### Azure
- **Azure Key Vault**
- **Setup**:
  ```bash
  az keyvault secret set \
    --vault-name uniflow-vault \
    --name jwt-secret \
    --value "your-64-char-secret"
  ```

#### Vercel/Netlify
- Use the environment variables dashboard
- Mark secrets as "sensitive" to hide in logs

## Security Checklist

### Initial Setup
- [ ] Generate secure secrets using the helper script
- [ ] Add secrets to `.env` file
- [ ] Verify `.env` is in `.gitignore`
- [ ] Test application startup
- [ ] Verify JWT generation and validation

### Before Production Deployment
- [ ] Generate production-specific secrets
- [ ] Store secrets in secrets manager (not `.env`)
- [ ] Configure environment variables in hosting platform
- [ ] Test secret retrieval
- [ ] Verify issuer/audience validation works

### Regular Maintenance
- [ ] Rotate secrets every 90 days
- [ ] Audit access logs for suspicious activity
- [ ] Review and update secret access permissions
- [ ] Test secret rotation process in staging
- [ ] Document any incidents or changes

## Common Mistakes to Avoid

### ❌ DON'T
- Commit `.env` file to version control
- Use simple/predictable secrets (e.g., "secret", "password123")
- Reuse secrets across environments
- Share secrets via email/chat
- Store secrets in application logs
- Use the same secret for access and refresh tokens

### ✅ DO
- Use cryptographically random secrets
- Keep secrets in `.env` or secrets manager
- Use different secrets per environment
- Rotate secrets regularly
- Audit secret access
- Use separate secrets for access and refresh tokens

## Troubleshooting

### Error: "JWT_SECRET must be set in production"
**Cause**: JWT_SECRET environment variable is missing or too short in production.
**Solution**: Set a proper 64+ character secret in your environment variables.

### Error: "Invalid token"
**Cause**: Token was signed with a different secret, or issuer/audience mismatch.
**Solution**: 
- Verify the correct secret is being used
- Check that issuer/audience match between signing and verification
- Clear old tokens and re-authenticate

### Tokens not working after deployment
**Cause**: Secret changed without proper rotation.
**Solution**: Either revert to old secret or blacklist all tokens and have users re-login.

## Additional Resources
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [JWT.io](https://jwt.io/) - JWT debugger
- [RFC 7519 - JWT Standard](https://tools.ietf.org/html/rfc7519)
