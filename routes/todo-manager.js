
var mongoose = require( 'mongoose' );
var Todo     = mongoose.model( 'Todo' );
var moment = require('moment');


exports.addNewTodo = function(newData, callback)
{
  if (newData.name == '' || newData.dew_date == '') {
      callback('both name and date fields are required');
  }
  Todo.findOne({name:newData.name}, function(e, o) {
    if (o){
      callback('name-already-taken');
    }else{
        newData.updated_at = moment();
        // u = User.create(newData, {safe: true});
        Todo.create(newData, function(err, newTodo) {
            if(err) return callback(err);
            callback(null, newTodo);
         });
      }
  });
}

exports.updateTodo = function(newData, callback)
{
  if (newData.name == '' || newData.dew_date == '') {
      callback('both name and date fields are required');
  }
  var todo = Todo.findById(newData.id, function (e, o){
    if (o){
      newData.updated_at = moment();
      o.update(newData, function(err, newTodo) {
          if(err) return callback(err);
          callback(null, newTodo);
       });
    }else{
      callback('name-already-taken');
      }
  });
}
