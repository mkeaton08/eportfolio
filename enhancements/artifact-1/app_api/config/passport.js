const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userService = require('../services/userService');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    async (email, password, done) => {
      try {
        const user = await userService.findUserByEmail(email);
        
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
