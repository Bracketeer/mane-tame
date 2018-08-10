const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const multer = require('multer');


// Register
router.post('/add', (req, res, next) => {
  let newUser = new User({
    first: req.body.first,
    last: req.body.last,
    email: req.body.email,
    password: req.body.password,
    image: req.body.image,
  });
  User.getUserByEmail(req.body.email, (err, user) => {
    if(user){
      return res.json({success: false, msg: 'Email is already registered.'})
    } else {
      User.addUser(newUser, (err, user) => {
        if(err) {
          res.json({success: false, msg: err});
        } else {
          res.json({success: true, msg: 'User registered'});
        }
      });
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    // if(err) throw err;
    if(!user) {
      return res.json({success: false, msg: 'Email or password is incorrect.'})
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch) {
        const account = {user: {_id: user._id}};
        console.log('auth ', account.user._id)
        
        const token = jwt.sign({data: {_id: user._id}}, process.env.SECRET, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Email or password is incorrect.'})
      }
    })
  })
});
router.post('/update', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  const user = req.body;
  
  User.getUserById(user._id, (err, profile) => {
    const id = user._id;
    const updatedUser = req.body;
    if(!user.password) {
      return res.json({success: false, msg: 'Email or password is incorrect.'})
    }

    User.comparePassword( user.password, profile.password, (err, isMatch) => {
      // if(err) throw err;
      if(isMatch) {
        User.updateUser(user, (err, updatedUser) => {
          if(err) {
            res.json({ success: false, msg: 'err'})
          } else {
            res.json({success: true, msg: 'user updated'})
          }
        })
      } else {
        return res.json({success: false, msg: 'Email or password is incorrect.'})
        }
      })
  })
});

router.post('/remove', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  const id = req.body._id;
  User.removeUser(id, (err, id) => {
    if (err) {
      res.json({ success: false, msg: 'err' });
    } else {
      res.json({ success: true, msg: 'user removed' });
    }
  })
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  }
});

const upload = multer({ //multer settings
  storage: multer.memoryStorage(), limits: {fileSize: 1000 * 1000 * 12}
          })

router.post('/upload', passport.authenticate('jwt', {session: false}), upload.any(), (req, res, next) => {
  const image = req.files[0];
  User.addUserPhoto(image, (err, image) => {
    if (err) {
      res.json({ success: false, msg: 'err' });
    } else {
      res.json({ success: true, msg: 'image added' });
    }
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user});
});

// Get User Profile with Params
router.post('/getprofile', (req, res, next) => {
  const id = req.body.params._id;
  User.getUserById(id, (err, profile) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      return res.json({ success: true, profile });
    }
  })
});

// Dashboard
router.post('/dashboard', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user});
});

//Users Panel
router.post('/overview', (req, res, next) => {
  User.getUsers((err, users) => {
    if (err) {
      res.send(err);
    } else {
      return res.json(users);
    }
  });
});

module.exports = router;
