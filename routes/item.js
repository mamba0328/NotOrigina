var express = require('express');
var router = express.Router();

const itemController = require('../controllers/itemController');

router.get('/:item', itemController.get);

module.exports = router;
