// Add Passport-related auth routes here.

var express = require('express');
var router = express.Router();
var models = require('../models/models');
var fromPhone = process.env.FROM_PHONE;

module.exports = function(passport) {

  // GET registration page
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  // POST registration page
  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/signup', function(req, res) {
    // validation step
    if (!validateReq(req.body)) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    var u = new models.User({
      username: req.body.username,
      password: req.body.password,
      phone: fromPhone
    });
    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
      console.log(user);
      res.redirect('/login');
    });
  });

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });


  // POST Login page
  router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/contacts');
  });

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  // FACEBOOK

  router.get('/auth/facebook',
    passport.authenticate('facebook'));

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/contacts');
    });

  return router;
};
