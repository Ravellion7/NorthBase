const express = require('express');
const router = express.Router();
const collectibleController = require('../controllers/collectibleController');

router.get('/user/:userId', collectibleController.getUserCollectibles);
router.post('/unlock', collectibleController.unlock);

module.exports = router;
