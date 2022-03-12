const omit = require("lodash/omit");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/User.model");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email });

      if (user) {
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          return done(null, omit(user.toObject(), ["password"]));
        }
      }

      return done(null, false, {
        message: "Incorrect user/password",
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ _id: id });

    if (user) {
      done(null, omit(user.toObject(), ["password"]));
    } else {
      done(null, false);
    }
  } catch (error) {
    done(null, false);
  }
});

module.exports = passport;
