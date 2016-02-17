var express = require('express');
var usersRouter = express.Router();
var User = require('../models/user');


usersRouter.get('/', function(req, res){
  User.find({}, function (err, databaseUser){
    res.json({users: databaseUser});
  });
});

usersRouter.get('/authenticate', function(req, res){
  User.find({}, function (err, databaseUser){
    res.json({users: databaseUser});
  });
});


usersRouter.post('/', function(req, res){
  var userData = req.body.user;
  var user = new User(userData);
  user.save(function (err, databaseUser){
    res.json({user: databaseUser});
  });
});

usersRouter.post('/authenticate', function(req, res){
  var usernameAttempt = req.body.username;
  var passwordAttempt = req.body.password;
  User.findOne({username: usernameAttempt}, function(err, databaseUser){
    if(databaseUser){
      databaseUser.authenticate(passwordAttempt, function(err, isMatch){
        if(isMatch){
          databaseUser.setToken(err, function(){
            res.json({username: databaseUser.username, token: databaseUser.token});
          });
        }
      });
    } else {
      res.json({description: 'password is incorrect', status: 302});
    }
  });
});


module.exports = usersRouter;
