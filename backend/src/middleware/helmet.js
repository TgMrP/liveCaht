const helmet = require("helmet");

module.exports = helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
    },
  },
});
