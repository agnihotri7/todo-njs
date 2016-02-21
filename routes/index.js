
var mongoose = require( 'mongoose' );
var Todo     = mongoose.model( 'Todo' );
var crypto   = require('crypto');
var moment   = require('moment');
var AM       = require('./account-manager');
var TM       = require('./todo-manager');

exports.index = function ( req, res ){
  Todo.find({user:req.session.user.email}, function ( err, todos, count ){
      res.render( 'index.ejs', {
      title : 'Todo',
      todos : todos
    });
  });
};

exports.login = function ( req, res ){
  res.render( 'login.ejs', {
    title : 'Login',
    message: req.flash('loginMessage')
  });
};

exports.loginPost = function ( req, res, callback ){
  AM.userLogin(req.body['email'], req.body['pass'], function(e, o){
    if (!o){
      res.render('login', {
        title : 'Login',
        message : e
      });
    }else{
      req.session.user = o;
      req.session.authorized = true;
      if (req.body['remember-me'] == 'true'){
        res.cookie('user', o.email, { maxAge: 900000 });
        res.cookie('pass', o.pass, { maxAge: 900000 });
      }
      res.redirect( '/' );
    }
  });
};

exports.logout = function(req, res) {
  req.cookies.user = null;
  req.cookies.pass = null;
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.signup = function ( req, res ){
  if (req.session && req.session.authorized){
    req.cookies.user = null;
    req.cookies.pass = null;
    req.session.authorized = false;
  }
  res.render( 'signup.ejs', {
    title : 'Signup',
    message: req.flash('loginMessage')
  });
};

exports.signupPost = function ( req, res ) {
  AM.addNewAccount({
      email   : req.body['email'],
      pass  : req.body['pass'],
    }, function(e, o){
    if (e) {
      res.render('signup', {
        title : 'signup',
        message : e
      });
    }else{
      req.session.user = o;
      res.redirect( '/' );
    }
  });
};

exports.todoList = function ( req, res ){
  Todo.find( function ( err, todos, count ){
    res.render( 'todo.list.ejs', {
      title : 'Todo List',
      todos : todos
    });
  });
};

exports.todoCreate = function ( req, res ) {
  res.render( 'create_todo.ejs', {
    title : 'Todo Create',
    message : ''
  });
};

exports.todoPost = function ( req, res ){
  TM.addNewTodo({
      name      : req.body['name'],
      dew_date  : req.body['dew_date'],
      location  : req.body['address'],
      user : req.session.user.email
    }, function(e, o){
    if (e){
      res.render('create_todo', {
        title : 'Create',
        message : e
      });
    }else{
      res.redirect( '/' );
    }
  });
};

exports.todoEdit = function ( req, res ){
  id = req.params.todoId
  Todo.findById(id, function (e, doc){
    if (e){
      res.render('http404', {
        title : 'http404',
      });
    }else{
      res.render('edit_todo', {
        title : 'Edit',
        todo : doc
      });
    }
  });
};

exports.todoUpdate = function ( req, res ){
  TM.updateTodo({
      id : req.params.todoId,
      name   : req.body['name'],
      dew_date  : req.body['dew_date'],
      location  : req.body['address'],
      user : req.session.user.email
    }, function(e, o){
    if (e){
      res.render('edit_todo', {
        title : 'Edit',
        todo : o,
        message : e
      });
    }else{
      res.redirect( '/' );
    }
  });
};
