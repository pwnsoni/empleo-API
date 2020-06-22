const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const connUri = process.env.MONGO_DEV_CONN_URL;
const Job = require('../models/jobs');

module.exports = {
  add: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser : true, useUnifiedTopology: true }, (err) => {
      let result = {};
      let status = 201;
      if (!err) {
        const payload = req.decoded;

        console.log('here 1')
        const {  description, jobProfile, organisation, salary, 
            skills, requirement, location, experience, applicants } = req.body;
        const dateOfPosting = new Date();
        const postedBy = payload.userName;

        console.log('here 2')
        // const jobId = '12345'

        const job = new Job({  description, jobProfile, organisation, salary, 
            skills, requirement, location, experience, applicants, dateOfPosting, postedBy}); // document = instance of a model
        // TODO: We can hash the password here as well before we insert

        

        console.log(job)
        job.save((err, user) => {
          if (!err) {
            result.status = status;
            result.result = job;
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

  getThisPost: async (req, res) => {
    let result = {};
    let status = 201;

    try{
        await mongoose.connect(connUri, { useNewUrlParser : true, useUnifiedTopology: true });
        const {_id} = req.params;
        const post = await Job.findOne({_id});

        if (!post){
            result.status = 404;
            throw new Error('Job Post not found  :)  !!')
        }
        result.error = null;
        result.result = post;
    } catch(e){
        if (!result.status) result.status = 500;
        result.error = e.message;
    }

    res.status(status).send(result);
    mongoose.connection.close();
  },
  
  deletePost: async (req, res) => {
    let result = {};
    let status = 201;

    try{
        await mongoose.connect(connUri, { useNewUrlParser : true, useUnifiedTopology: true });
        
        const {_id} = req.params;

        const payload = req.decoded;

        const post = await Job.findOne({_id});

        if (!post){
            result.status = 404;
            throw new Error('Job Post not found  :)  !!')
        }

        if (payload.user != post.postedBy){
            result.status = 401;
            throw new Error('unauthorised deletion : Please delete your own Job Post  :)  !!')
        }

        await Job.deleteOne({_id});
        result.error = null;
        result.result = 'deleted successfully';
    } catch(e){
        if (!result.status) result.status = 500;
        result.error = e.message;
    }

    res.status(status).send(result);
    mongoose.connection.close();

  },
  
  updatePost: async (req, res) => {
    let result = {};
    let status = 201;

    try{
        await mongoose.connect(connUri, { useNewUrlParser : true, useUnifiedTopology: true });
        const { designation, description, jobProfile, organisation, salary, 
            skills, requirement, location, experience, applicants } = req.body;

        const {_id} = req.params;

        const payload = req.decoded;

        const post = await Job.findOne({_id});

        if (!post){
            result.status = 404;
            throw new Error('Job Post not found  :)  !!')
        }

        if (payload.user !== post.postedBy){
            post.applicants.push(payload.userName);
        } else{
            post.designation = designation;
            post.description = description;
            post.jobProfile = jobProfile;
            post.organisation = organisation;
            post.salary = salary;
            post.skills = skills;
            post.requirement = requirement;
            post.location = location;
            post.experience = experience;
         }

        const updatedPost = await post.save();
        result.error = null;
        result.result = updatedPost;

    } catch(e){
        if (!result.status) result.status = 500;
        result.error = e.message;
    }

    res.status(status).send(result);
    mongoose.connection.close();

  },

  getMyPosts: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser : true, useUnifiedTopology: true }, async (err) => {
      let result = {};
      let status = 201;
      console.log('getMyPosts')
      const payload = req.decoded;

      if (!payload){
        result.status = 401;
        throw new Error('You must login first   :)  !!');
      }

      const postedBy = payload.userName;
        if (!err){
         try{
          const posts = await Job.find({postedBy});
          result.status = status;
          result.error = err;
          result.result = posts;
         } catch(e){
             result.status = 500;
             result.error = e;
         }
         res.status(status).send(result);
         mongoose.connection.close();

      }
    });
  },

  getAll: async (req, res) =>{
    mongoose.connect(connUri, { useNewUrlParser : true, useUnifiedTopology: true }, async (err) => {
        let result = {};
        let status = 201;

        if (!err){
           try{
            const posts = await Job.find({});
            result.status = status;
            result.error = err;
            result.result = posts;
           } catch(e){
               result.status = 500;
               result.error = e;
           }
           res.status(status).send(result);
           mongoose.connection.close();

        }
    });
  }
}