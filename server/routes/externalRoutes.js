const express = require('express');
const router = express.Router();
const externalStatsController = require('../controllers/externalStatsController');

router.get('/teams/:teamKey/stats', externalStatsController.getTeamStats);

module.exports = router;
