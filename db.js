
var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Todo = new Schema({
    name       : String,
    user       : String,
    dew_date   : Date,
    location   : String,
    is_closed  : Boolean,
    updated_at : Date
});

var User = new Schema({
    email      : { type: String, required: true, unique: true },
    pass       : { type: String, required: true },
    updated_at : Date
});

mongoose.model( 'User', User );
mongoose.model( 'Todo', Todo );
mongoose.connect( 'mongodb://localhost/todo' );
