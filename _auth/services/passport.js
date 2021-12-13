const passport = require('passport')
const mongoose = require('mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = mongoose.model('User')

passport.use(new GoogleStrategy({
  clientID: '<google-client-id>',
  clientSecret: '<google-client-secret>',
  callbackURL: 'https://<domain-url>/auth/google/callback',
  proxy: true
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value

  let user = {}

  const userExists = await User.findOne({ email })
  if (userExists) {
    user = userExists
    done(null, user)
  } else {
    return done(null, false, { errors: { 'email or password': 'is invalid' } })
  }
}
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  });
})
