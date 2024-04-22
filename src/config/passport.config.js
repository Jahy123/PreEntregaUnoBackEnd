const passport = require("passport");
const jwt = require("passport-jwt");
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const UserModel = require("../services/models/user.model.js");
const configObject = require("../config/config.js");
const { secret_or_key, token } = configObject;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: secret_or_key,
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserModel.findById(jwt_payload.user._id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

const cookieExtractor = (req) => {
  let Token = null;
  if (req && req.cookies) {
    Token = req.cookies[token];
  }
  return Token;
};

module.exports = initializePassport;
