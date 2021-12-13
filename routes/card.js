const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Card = mongoose.model('Card');
const multer = require('multer');
const util = require('../utils');
const storage = multer.diskStorage({
  destination: 'public/images',
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage }).single("image");

router.post('/upload', async (req, res) => {
  upload(req, res, (err) => {
    if(err) {
      res.status(400).send("Something went wrong!", err);
    }
    res.send(req.file);
  });
});

// util.checkAuthentication can be used to authenticate api routes (post methods alone). This ensures only authorised persons edit/delete/create cards.
// Example: router.post('/create', util.checkAuthentication, async function (req, res) { 
//      ...
// });

router.post('/create', async function (req, res) {
  if (req.body) {
    var config = new Card(req.body);
    await config.save(function (err, config) {
      if (err) {
        console.log('Card creation failed !', err);
        return res.status(500).send(err);
      }
      res.json({
        success: true,
        type: 'success',
        message: 'Card created succesfully !'
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
  var list = await Card.find({});
  if (list.length === 0) {
    res.json({
      cards: [],
      message: 'No data found !'
    });
  } else {
    // list.forEach(function (val, index) {
    //   JSON.stringify(val);
    // });
    res.json({
      cards: list,
      message: 'Cards retrieved successfully !'
    });
    res.end();
  }
});

router.post('/update', async function (req, res) {
  if (req.body) {
    let record = await Card.findOne({  _id: req.body.oldCard  });
    if (record) {
      record.set(req.body);
    } else {
      record = new Card(req.body);
    }
    await record.save(function (err, updatedData) {
      if (err) {
        res.json({
          success: false,
          type: 'error',
          message: 'Error updating card !'
        });
      }
      res.json({
        succes: true,
        type: 'success',
        message: 'Card has been updated successfully !'
      });
      res.end();
    });
  }
});

router.post('/delete', async function (req, res) {
  if (req.body) {
    const card = await Card.findOne({ _id: req.body._id });
    if (!card) {
      res.send({
        type: 'warning',
        message: 'Card does not exist !'
      });
    } else {
      card.remove(function (err, data) {
        if (err) {
          res.status(500).json({
            type: 'error',
            message: 'There has been an error while deleting the card !'
          });
        } else {
          res.status(200).send({
            type: 'success',
            message: 'Card has been deleted successfully !'
          });
        }
      });
    }
  }
});

module.exports = router;
