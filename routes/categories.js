var express = require('express');
var router = express.Router();

const itemRouter = require('./item');
const categoriesController = require('../controllers/categoriesController');

router.use('/:category', itemRouter);

router.get('/:category', categoriesController.get);

module.exports = router;
