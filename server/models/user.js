var mongoose  = require('mongoose'),
    bcrypt    = require('bcrypt'),
    crypto    = require('crypto'),
    randToken = require('rand-token');



var UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String }
}, {timestamps:true});



UserSchema.pre('save', function(next){
  if(this.isModified('password')){
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

UserSchema.methods.setToken = function(err, callback){
  var scope = this;
  crypto.randomBytes(256, function(err, rawToken){
    // if(err) return callback(err);
    scope.token = rawToken;
    scope.save(function(){
      if(err) return callback(err);
      callback();
    });
  });
};

UserSchema.methods.authenticate = function(passwordAttempt, callback){
  bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){
    if(err) {return callback(err)};
    callback(null, isMatch);
  });
};


module.exports = mongoose.model('User', UserSchema);;
