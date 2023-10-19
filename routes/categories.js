var express = require('express');
var router = express.Router();

const itemController = require('../controllers/itemController');
const categoriesController = require('../controllers/categoriesController');

router.get('/category/create',  categoriesController.createGET);

router.post('/category/create',  categoriesController.createPOST);

router.get('/category/delete/:id',  categoriesController.deleteGET);

router.get('/item/delete/:id', itemController.deleteGET);

router.get('/item/create', itemController.createGet);

router.post('/item/create', itemController.createPOST);

router.use('/:category/:item', itemController.get);

router.get('/:category', categoriesController.get);

module.exports = router;
