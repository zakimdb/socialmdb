var mongoose = require('mongoose');

mongoose.connect('mongodb://user:user@ds135577.mlab.com:35577/socialdb');
var db = mongoose.connection;

// User Schema
var UserShema = mongoose.Schema({
  pseudo: {
    type: String,
    index: true
  },
  nom: {
    type: String
  },
  prenom: {
    type: String
  },
  email: {
    type: String
  },
  mdp: {
    type: String,
    required: true
  },
  profession: {
    type: String
  },
  adresse: {
    type: String
  },
  anniversaire: {
    type: String
  },
  bio: {
    type: String
  }

});

var User = module.exports = mongoose.model('User', UserShema);

module.exports.getUserById = function(id, callback){
  User.findById(id,callback);
}
module.exports.getUserByUsername = function(username, callback){
  var query = {'pseudo': username};
  User.findOne(query, callback);
}

module.exports.createUser = function(newUser, callback){
  newUser.save(callback);
}
