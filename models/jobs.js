const mongoose = require('mongoose');

const environment = process.env.NODE_ENV;

// schema maps to a collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
  description: {
    type: 'String',
    required: true,
    trim: true,
  },
  postedBy: {
    type: 'String',
    required: true,
    trim: true
  },
  jobProfile: {
    type: 'String',
    required: true,
    trim: true
  },
  organisation: {
    type: 'String',
    required: true,
    trim: true
  },
  salary: {
    type: 'String',
    required: true,
    trim: true
  },
  skills: {
    type: [String],
    required: true,
    trim: true
  },
  dateOfPosting:{
      type: 'Date',
      required: true
  },
  requirement: {
    type: 'String',
    required: true,
    trim: true
  },
  location: {
    type: 'String',
    required: true,
    trim: true
  },

  experience: {
    type: 'Number',
    required: true,
    trim: true
  },

  applicants: {
      type: [String]
  }
});


module.exports = mongoose.model('Job', userSchema);