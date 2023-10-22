var express = require('express');
var router = express.Router();

const itemController = require("../controllers/itemController");
const iteminstanceController = require("../controllers/iteminstanceController");

//CREATE ITEM
router.get('/item/create', itemController.createGet);

router.post('/item/create', itemController.createPOST);

//DELETE ITEM INSTANCE
router.get('/:item/:size/delete', iteminstanceController.deleteGET);

//DELETE ITEM
router.get('/:item/delete', itemController.deleteGET);

//CREATE ITEM INSTANCE
router.get('/:item/create-instance', iteminstanceController.createGET)
router.post('/:item/create-instance', iteminstanceController.createPOST)


//GET ITEM PAGE
router.use('/:item/:size', itemController.get);
router.use('/:item', itemController.get);

module.exports = router;
