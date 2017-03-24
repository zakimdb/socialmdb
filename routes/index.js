var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

// GET Home page.
router.get('/', ensureAuthenticated, function(req, res, next)
{
    res.render('index', {
                             title: 'Home',
                             pseudo: req.user.pseudo,
                            profession:req.user.profession,
                            adresse:req.user.adresse,
                            anniversaire:req.user.anniversaire
                            });

});

function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/users');
}

router.get('/logout', function(req, res)
{
    req.logout();
    //req.session.destroy();
    req.flash('success', 'You are logged out');
    res.redirect('/users');
});


module.exports = router;
