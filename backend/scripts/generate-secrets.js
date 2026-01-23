#!/usr/bin/env node

/**
 * Generate Secure JWT Secrets
 * 
 * This script generates cryptographically secure random secrets for JWT tokens.
 * Run this script to generate new secrets when:
 * - Setting up a new environment
 * - Rotating secrets (recommended every 90 days in production)
 * - After a security incident
 * 
 * Usage:
 *   node scripts/generate-secrets.js
 */

const crypto = require('crypto');

console.log('🔐 Generating Secure JWT Secrets...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Generate 256-bit (64 hex characters) secrets
const jwtSecret = crypto.randomBytes(64).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');

console.log('\n✅ Add these to your .env file:\n');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n⚠️  IMPORTANT SECURITY NOTES:\n');
console.log('1. Never commit these secrets to version control');
console.log('2. Store them securely (use a secrets manager in production)');
console.log('3. Use different secrets for each environment');
console.log('4. Rotate secrets regularly (every 90 days recommended)');
console.log('5. After rotating, blacklist all existing tokens\n');

console.log('🔒 Production Deployment:');
console.log('   - AWS: Use AWS Secrets Manager or Parameter Store');
console.log('   - GCP: Use Google Secret Manager');
console.log('   - Azure: Use Azure Key Vault');
console.log('   - Vercel/Netlify: Use environment variables dashboard\n');
