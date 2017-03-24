var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy =  require('passport-local').Strategy;
var User = require('../models/user');

// GET users listing.
router.get('/', function(req, res, next)
{
    if(req.isAuthenticated()){
      res.redirect('/');
    } else {
    res.render('sign', {
       'title': 'Login Registre',
        message: req.flash('echecLogin')
        //errors: req.validationErrors()
      });
   }
});






router.post('/register', function(req, res, next)
{
    // Get Form Values
    var pseudo = req.body.formPseudo;
    var nom = req.body.formFirstName;
    var prenom = req.body.formLastName;
    var email = req.body.formEmail;
    var mdp = req.body.formPasswordR;
    var profession = req.body.formProfession;
    var adresse = req.body.formAdresse;
    var anniversaire = req.body.formBirthday;
    var bio = req.body.formBio;

/*    // Form Validation
    req.checkBody('pseudo', 'Pseudo field is required').notEmpty();
    req.checkBody('nom', 'Nom field is required').notEmpty();
    req.checkBody('prenom', 'Prenom field is required').notEmpty();
    req.checkBody('email', 'Email field id required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('mdp', 'Password field is required').notEmpty();
    req.checkBody('profession', 'profession field is required').notEmpty();
    req.checkBody('adresse', 'adresse field is required').notEmpty();
    req.checkBody('anniversaire', 'Password field is required').notEmpty();

    // check For Error
    var errors = req.validationErrors();

    if (errors){
      res.render('sign',{
        errors: errors,
        pseudo: pseudo,
        nom: nom,
        prenom: prenom,
        email: email,
        mdp: mdp,
        profession: profession,
        adresse: adresse,
        anniversaire: anniversaire
      });
    } else { */
      var newUser = new User({
        pseudo: pseudo,
        nom: nom,
        prenom: prenom,
        email: email,
        mdp: mdp,
        profession: profession,
        adresse: adresse,
        anniversaire: anniversaire,
        bio: bio
        });

      // create User
      User.createUser(newUser, function(err, user){
        if (err) throw err;
        console.log(user);
      });

      // Success message
      req.flash('success', 'You are registred and may log in');

      res.location('/users');
      res.redirect('/users');
    //}
}); // End Post registre

// Use Passport

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id,done){
  User.getUserById(id, function(err, user){
    done(err, user);
  });
});
passport.use(new LocalStrategy({
  usernameField: 'formUsername',
  passwordField: 'formPassword',
  passReqToCallback: true // =====> req.flash :sinon req.flash is not a function
},
  function(req, username, password, done){
    User.getUserByUsername(username, function(err, user){
      if (err) throw err;
      if (!user){
        console.log('Unknow User');
        return done(null, false, req.flash('echecLogin', 'Unknow User'));
      }
      var compare = user.mdp.localeCompare(password);
      if(compare==0){
        return done(null, user);
      } else {
        console.log('Invalid Password');
        return done(null, false, req.flash('echecLogin', 'Invalide Password'));
      }
    });
  }
));



router.post('/login', passport.authenticate('local', {failureRedirect:'/', failureFlash:'Invalide Username or password'}), function(req, res)
{
console.log('Authentication Succesful');
//req.flash('success', 'You are logged in');
res.redirect('/');

}); // end POST login

module.exports = router;
