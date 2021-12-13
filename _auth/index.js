const passport = require('passport')

module.exports = function (app) {
  app.get('/login', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))

  app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}),function(req, res) {
    // Successful authentication, redirect to admin dashboard
    res.redirect(`/admin/active-cards`);
})

  app.get('/auth/logout', (req, res) => {
    res.redirect('/')
  })
}
