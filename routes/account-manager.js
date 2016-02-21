
var mongoose = require( 'mongoose' );
var User     = mongoose.model( 'User' );
var moment = require('moment');
var crypto    = require('crypto');


/* private encryption & validation methods */
var generateSalt = function(){
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
}

var md5 = function(str){
    return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback){
    var salt = generateSalt();
    callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback){
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    callback(null, hashedPass === validHash);
}

exports.userLogin = function(email, pass, callback){
    User.findOne({email:email}, function(e, o) {
        if (o == null){
            callback('user-not-found');
        }else{
            validatePassword(pass, o.pass, function(err, res) {
                if (res){
                    callback(null, o);
                }else{
                    callback('invalid-password');
                }
            });
        }
    });
}

exports.addNewAccount = function(newData, callback)
{
    if (newData.email == '' || newData.pass == '') {
        callback('both email and pass fields are required');
    }
    User.findOne({email:newData.email}, function(e, o) {
        if (o){
            callback('username-already-taken');
        }else{
            saltAndHash(newData.pass, function(hash){
                newData.pass = hash;
                // append date stamp when record was created //
                newData.updated_at = moment();
                // u = User.create(newData, {safe: true});
                User.create(newData, function(err, newUser) {
                    if(err) return callback(err);
                    callback(null, newUser);
                });
            });
        }
    });
}
