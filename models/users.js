const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

// schema maps to a collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: 'String',
    required: true,
    trim: true,
    unique: true
  },
  fullName: {
    type: 'String',
    required: true,
    trim: true,
  },
  password: {
    type: 'String',
    required: true,
    trim: true
  },
  email: {
    type: 'String',
    required: true,
    trim: true,
    unique: true
  },
  userType: {
    type: 'String',
    required: true,
    trim: true
  },

  profiles:{
    type: 'String'
  },

  professionalSummary:{
    type: 'String'
  },

  appliedJobs: {
    type: [String]
  }
});

// encrypt password before save
userSchema.pre('save', function(next) {
  const user = this;
  if(!user.isModified || !user.isNew) {
    next();
  } else {
    bcrypt.hash(user.password, stage.saltingRounds, function(err, hash) {
      if (err) {
        console.log('Error hashing password for user', user.name);
        next(err);
      } else {
        user.password = hash;
        next();
      }
    });
  }
});

module.exports = mongoose.model('User', userSchema);