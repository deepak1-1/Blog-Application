
const express = require('express');
const router = express.Router();
const basicController = require('../controllers/basicController');

router.get('/', basicController.get_home); // home 
router.get('/about', basicController.get_about); // about

module.exports = router;