const express = require('express');
const router = express.Router();
const server = require('../controllers/general');

//-----------------------GENERAL-------------------------
router.get('/home', server.viewHome);

router.post('/filter' , server.viewHomeFiltered);
router.post('/chooseProperties', server.manuallySendingData);
router.post('/activatingTimer' , server.settingTimer);
module.exports = router;