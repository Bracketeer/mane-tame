const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  first: {
    type: String,
    required: true
  },
  last: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: Array,
    required: false
  }
});

const User = module.exports = mongoose.model('users', UserSchema);

module.exports.getUserById = (id, callback) => {
  User.findById({_id: id}, callback);
}

module.exports.getUsers = (users, callback) => {
  User.find(users, callback);
}

module.exports.getUserByEmail = (email, callback) => {
  const query = {email: email}
  User.findOne(query, callback);
}

module.exports.removeUser = (id, callback) => {
  User.remove({_id: id}, callback);
}

module.exports.updateUser = (user, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if(err) throw err;
      user.password = hash;
      User.update({_id: user._id}, user, callback);
    });
  });
}

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.addUserPhoto = (image, callback) => {
  User.update({_id: image.fieldname}, {$set: { image: image}}, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });

}
