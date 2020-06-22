const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const connUri = process.env.MONGO_DEV_CONN_URL;
const User = require('../models/users');

module.exports = {
  add: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser : true, useUnifiedTopology: true }, (err) => {
      let result = {};
      let status = 201;
      if (!err) {
        const { email, password, userType, fullName, userName } = req.body;
        const user = new User({ email, password, userType, fullName, userName}); // document = instance of a model
        // TODO: We can hash the password here as well before we insert


        console.log(user)
        console.log('above save')

        user.save((err, user) => {
          if (!err) {
            result.status = status;
            result.result = user;
            console.log(user)
            console.log('under save')
          } else {
            status = 500;
            result.status = status;
            result.error = err;
          }
          res.status(status).send(result);
          // Close the connection after saving
          mongoose.connection.close();
        });
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);

        mongoose.connection.close();
      }
    });
  },

  update: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const payload = req.decoded;
        const { github, linkedin, website, facebook, professionalSummary, appliedJob } = req.body;
        const email = payload.user;

        console.log(payload);
        if (payload ) {
          User.findOne({email}, (err, user) => {
            if (!err) {
              result.status = status;
              let profiles = {};
              console.log(user + '[[]]]]\\\\\.ll')

              if (appliedJob){
                user.appliedJobs.push(payload.userName);
              } else{
                if(user.profiles) profiles = JSON.parse(user.profiles);
                
                profiles.github = github;
                profiles.linkedin = linkedin;
                profiles.globe = website;
                profiles.facebook = facebook;

                user.profiles = JSON.stringify(profiles);
                user.professionalSummary = professionalSummary;
              }
              user.save((err, user) => {
                if (!err) {
                  result.status = status;
                  result.result = user;
                } else {
                  status = 500;
                  result.status = status;
                  result.error = err;
                }
              });

              console.log(user + "updated");

              result.error = err;
              result.result = user;
            } else {
              status = 500;
              result.status = status;
              result.error = err;
            }
            res.status(status).send(result);
          }).then(() => mongoose.connection.close());
        } else {
          status = 401;
          result.status = status;
          result.error = `Authentication error`;
          res.status(status).send(result);

          mongoose.connection.close();
        }
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);

        mongoose.connection.close();
      }
    });
  },

  login: (req, res) => {
    const { email, password, userType } = req.body;


    console.log(email )
    console.log(password)
    console.log('login')

    mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
      let result = {};
      let status = 200;
      if(!err) {

        User.findOne({email}, (err, user) => {
          if (!err && user) {
            console.log('!!!!!!!!')
            console.log(user)
            // We could compare passwords in our model instead of below as well

            // if (user.userType != userType){
            //   status = 500;
            //   result.status = status;
            //   result.error = "You're not a " + userType;
            // }
            bcrypt.compare(password, user.password).then(match => {
              if (match) {
                status = 200;
                // Create a token
                const payload = { user: user.email, userName: user.userName };
                const options = { expiresIn: '2d', issuer: 'https://scotch.io' };
                const secret = process.env.JWT_SECRET;
                const token = jwt.sign(payload, secret, options);

                result.token = token;
                result.status = status;
                result.result = user;
              } else {
                status = 401;
                result.status = status;
                result.error = `Authentication error`;
              }
              res.status(status).send(result);
            }).catch(err => {
              status = 500;
              result.status = status;
              result.error = err;
              res.status(status).send(result);

              mongoose.connection.close();
            });
          } else {
            status = 404;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
          }
        }).then(() => 
          mongoose.connection.close());
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);

        mongoose.connection.close();
      }
    });
  },

  getAll: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const payload = req.decoded;
        console.log(payload);
        if (payload && payload.email === 'admin') {
          User.find({}, (err, users) => {
            if (!err) {
              result.status = status;
              result.error = err;
              result.result = users;
            } else {
              status = 500;
              result.status = status;
              result.error = err;
            }
            res.status(status).send(result);
          }).then(() => mongoose.connection.close());
        } else {
          status = 401;
          result.status = status;
          result.error = `Authentication error`;
          res.status(status).send(result);

          mongoose.connection.close();
        }
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);

        mongoose.connection.close();
      }
    });
  },

  getUser: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        // const payload = req.decoded;
        // // console.log(payload);
        // if (payload && payload.email === req.params.user) {

        const {userName} = req.params;
          User.findOne({userName}, (err, users) => {
            if (!err) {
              result.status = status;
              result.error = err;
              result.result = users;
            } else {
              status = 500;
              result.status = status;
              result.error = err;
            }
            res.status(status).send(result);
          }).then(() => mongoose.connection.close()); 
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);

        mongoose.connection.close();
      }
    });
  },

  getCurrentUser: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const payload = req.decoded;
        console.log(payload);
        console.log("getCurrentUser")
        // if (payload && payload.email === req.params.user) {
          const email = payload.user;

          User.findOne({email}, (err, users) => {
            if (!err) {
              result.status = status;
              result.error = err;
              result.result = users;
            } else {
              status = 500;
              result.status = status;
              result.error = err;
            }
            res.status(status).send(result);
          }).then(() => mongoose.connection.close()); 
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);

        mongoose.connection.close();
      }
    });
  }
};
