const express = require('express');
const router = express.Router();
const util = require('../utils');

// This api is to check if an user is authenticated to access the react route /admin/* and set the state 'verifiedUser' accordingly in client side
// this is an alternate approach to authtenticate client side react routes such as, '/admin/create-cards' using server side api
// this api will be called everytime the user calls the react route '/admin'.
router.get('/', async function (req, res) {
  res.json({
    status: 200,
    success: true,
    type: 'success',
    message: 'User Verified !'
  });
});

module.exports = router;
