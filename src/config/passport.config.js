const passport = require("passport");
const local = require("passport-local");

const UserModel = require("../dao/models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const GitHubStrategy = require("passport-github2");
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await UserModel.findOne({ email });
          if (user) return done(null, false);

          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            rol: "user",
          };

          let result = await UserModel.create(newUser);

          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            console.log("Este usuario no existe");
            return done(null, false);
          }

          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.4698cd6ff9ac6212",
        clientSecret: "db5c83fc274c0610c2503dbce490e1b204df741c",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Profile: ", profile);
        try {
          let user = await UserModel.findOne({ email: profile._json.email });

          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: "",
              email: profile._json.email,
              password: "",
            };
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
