const path = require('path');

require("dotenv").config({
  path: path.join(process.cwd(), '.env'),
  override: true,
});

console.log("JWT_SECRET do processo:", process.env.JWT_SECRET); // DEBUG

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN
};