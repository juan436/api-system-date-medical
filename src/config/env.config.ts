export const envConfig = () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/system-date',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
});
