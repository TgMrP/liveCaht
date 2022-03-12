const crypto = require("crypto");
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const config = require("../config");
const { sign } = require("../config/jwt");

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: false, default: false },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

// eslint-disable-next-line func-names
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = bcrypt.genSaltSync(config.keys.saltWorkFactor);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return next();
});

// eslint-disable-next-line func-names
userSchema.methods.comparePassword = function (password) {
  const user = this;
  const userObject = user.toObject();
  return bcrypt.compare(password, userObject.password);
};

// eslint-disable-next-line func-names
userSchema.methods.createToken = function () {
  const user = this;
  return sign({
    id: user._id,
    email: user.email,
  });
};

// eslint-disable-next-line func-names
userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000;
};

module.exports = model("User", userSchema);
