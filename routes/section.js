const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Section = mongoose.model('Section');
const util = require('../utils');

// util.checkAuthentication can be used to authenticate api routes (post methods alone). This ensures only authorised persons edit/delete/create content.
// Example: router.post('/create', util.checkAuthentication, async function (req, res) { 
//      ...
// });

router.post('/create', async function (req, res) {
  if (req.body) {
    var config = new Section(req.body);
    await config.save(function (err, config) {
      if (err) {
        console.log('Section creation failed !', err);
        return res.status(500).send(err);
      }
      res.json({
        success: true,
        type: 'success',
        message: 'Section created succesfully !'
      });
      res.end();
    });
  } else {
    res.json({
      success: false,
      type: 'failure',
      message: 'Request body is not found !'
    });
    res.end();
  }
});

router.get('/get', async function (req, res) {
  var content = await Section.find({});
  if (content.length === 0) {
    res.json({
      data: '',
      message: 'No data found !'
    });
  } else {
    res.json({
      section: content,
      message: 'Section data retrieved successfully !'
    });
    res.end();
  }
});

router.post('/update', async function (req, res) {
  if (req.body) {
    let record = await Section.find();
    if (record.length) {
      record = record[0];
      record.set(req.body);
    } else {
      record = new Section(req.body);
    }
    await record.save(function (err, updatedData) {
      if (err) {
        res.json({
          success: false,
          type: 'error',
          message: 'Error updating section data !'
        });
      }
      res.json({
        success: true,
        type: 'success',
        message: 'Section has been updated successfully !'
      });
      res.end();
    });
  }
});
module.exports = router;
