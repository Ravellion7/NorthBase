const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/save', gameController.saveMemorama);

module.exports = router;
