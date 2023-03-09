const express = require('express');
const router = express.Router();
const server = require('../controllers/general');

//-----------------------GENERAL-------------------------
router.get('/home', server.viewHome);

module.exports = router;