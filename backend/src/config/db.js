const mongoose = require("mongoose");
const config = require("./index");

module.exports = () => {
  const uri = config.db.uri
    ? config.db.uri
    : `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`;

  return mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((m) => {
      // TODO:   maybe when create logger add log that db connected
      return m.connection.getClient();
    })
    .catch((error) => {
      // TODO:   maybe when create logger add log that have error
      console.error(error);
      process.exit(1); // Close The APP
    });
};
