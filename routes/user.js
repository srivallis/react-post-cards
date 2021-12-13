const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const util = require('../utils');

// util.checkAuthentication can be used to authenticate api routes (post methods alone). This ensures only authorised persons edit/delete/create cards.
// Example: router.post('/create', util.checkAuthentication, async function (req, res) { 
//      ...
// });
router.post('/create', async function (req, res) {
  if (req.body) {
    var config = new User(req.body);
    await config.save(function (err, config) {
      if (err) {
        res.json({
          success: false,
          type: 'Failure',
          message: 'User creation failed !'
        });
        console.log('User creation failed !', err);
      }
      else {
        res.json({
        success: true,
        type: 'success',
        message: 'User created succesfully !'
        });
      }
        res.end();
    });
  }
});

router.get('/get', async function (req, res) {
  var list = await User.find({});
  if (list.length === 0) {
    res.json({
      users: [],
      message: 'No data found !'
    });
  } else {
    list.forEach(function (val, index) {
      JSON.stringify(val);
    });
    res.json({
      users: list,
      message: 'User data retrieved successfully !'
    });
    res.end();
  }
});

router.post('/update', async function (req, res) {
  if (req.body) {
    let record = await User.findOne({  email: req.body.oldEmail  });
    if (record) {
      record.set(req.body);
    } else {
      record = new User(req.body);
    }
    await record.save(function (err, updatedData) {
      if (err) {
        res.json({
          success: false,
          type: 'error',
          message: 'Error updating user !'
        });
        console.log('User updation failed !', err);
      }
      else {res.json({
          succes: true,
          type: 'success',
          message: 'User has been updated successfully !'
        });
        res.end();
      }
    });
  }
});

router.post('/delete', async function (req, res) {
  if (req.body) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.send({
        type: 'warning',
        message: 'User record does not exist !'
      });
    } else {
      user.remove(function (err, data) {
        if (err) {
          res.status(500).json({
            type: 'error',
            message: 'There has been an error while deleting the user !'
          });
        } else {
          res.status(200).send({
            type: 'success',
            message: 'User has been deleted successfully !'
          });
        }
      });
    }
  }
});

module.exports = router;
