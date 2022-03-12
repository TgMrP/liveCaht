const $session = require("express-session");
const mongoStore = require("connect-mongo");
const config = require("../config");

const session = (connect = null) => {
  if (!connect) return;
  return $session({
    name: config.session.name,
    store: new mongoStore({
      clientPromise: connect(),
      dbName: config.db.name,
      ttl: config.session.ttl,
      crypto: {
        secret: config.session.secret,
      },
      autoRemove: "interval",
      autoRemoveInterval: 1,
    }),
    secret: config.session.secret,
    cookie: {
      maxAge: config.session.maxAge,
    },
    resave: true,
    saveUninitialized: true,
  });
};

module.exports = session;
