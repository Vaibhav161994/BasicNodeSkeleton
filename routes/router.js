var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require('path');
var bcrypt = require('bcrypt');


// GET route for reading data
router.get('/', function (req, res, next) {
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      }
      else {
        if (user === null) {
          console.log('Not authorized! Go back!');            
          return  res.sendFile(path.join(__dirname + '/../views/index.html'));
          
        }
    }
   return res.sendFile(path.join(__dirname + '/../views/profile.html'));
});
});

router.get('/login', function (req, res, next) {
    return res.sendFile(path.join(__dirname + '/../views/login.html'));
  });

  router.get('/contact', function (req, res, next) {
    return res.sendFile(path.join(__dirname + '/../views/contact.html'));
  });

router.get('/signup', function (req, res, next) {
    return res.sendFile(path.join(__dirname + '/../views/signup.html'));
  });
router.post('/getusername', function (req, res, next) {
  console.log("In getting username..")
  User.findById(req.session.userId)
  .exec(function (error, user) {
    if (error) {
      return next(error);
    }  
    console.log(req.session.user);
    var user = req.session.user;
    return res.send(user); 
  }); 
}); 

  router.get('/logout', function (req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  });

router.get('/profile', function (req, res, next) {
    console.log(req.session.userId);
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          console.log('Not authorized! Go back!');
          res.redirect('/login');
        } else {
          res.sendFile(path.join(__dirname + '/../views/profile.html'));
          //return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>');
        }
      }
    });
  });

router.post('/signup', function(req, res, next){
    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10)
     });
     user.save(function(err, results){
        if(err)
        {
           return res.status(500).json({
               title:'An Error Occured..',
               error : err
           });
        }
        res.status(200).json({
           message:'User Created ..',
           obj : results
       });
     });
     
});

router.post('/signin', function(req, res, next){
        console.log('In Login Controller....')
        console.log(req.body.email);
        User.findOne({email: req.body.email}, function(err, user){
            if(err){
                return res.status(500).json({
                    title:'An Error Occured..',
                    error : err
                 });
            }
            if(!user){
                return res.status(500).json({
                    title:'Login Failed',
                    error : {message : 'Invalid Login Credentials..'}
                });
            }
            if(!bcrypt.compareSync(req.body.password,user.password)){
                return res.status(500).json({
                    title:'Login Failed',
                    error : {message : 'Invalid Login Credentials..'}
                });
            }
            req.session.user = user
            console.log(user);
            req.session.userId = user._id;
            return res.redirect('/profile');
        });
});

module.exports = router;