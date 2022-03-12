const jwt = require("jsonwebtoken");
const config = require("./index");

function sign(payload, options) {
  return jwt.sign(payload, config.jwt.secret, options);
}

function decode(token) {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    return { decoded, valid: true, expired: false };
  } catch (error) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
}

module.exports = {
  sign,
  decode,
};
