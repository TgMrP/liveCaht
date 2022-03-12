module.exports = {
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || "0.0.0.0",
  },
  session: {
    name: process.env.SESSION_NAME || "test",
    ttl: process.env.SESSION_TTL || 3600000 * 24 * 14,
    secret: process.env.SESSION_SECRET || "secret",
    maxAge: process.env.SESSION_MAX_AGE || 3600000 * 24 * 14,
  },
  db: {
    uri: process.env.DB_URI || null,
    host: process.env.DB_HOST || null,
    port: process.env.DB_PORT || null,
    name: process.env.DB_NAME || "test",
    user: process.env.DB_USER || "test",
    password: process.env.DB_PASSWORD || "test",
  },
  jwt: {
    secret: process.env.SESSION_SECRET || "secret",
  },
};
