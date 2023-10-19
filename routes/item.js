var express = require('express');
var router = express.Router();

const itemController = require("../controllers/itemController");


//CREATE ITEM
router.get('/item/create', itemController.createGet);

router.post('/item/create', itemController.createPOST);

//DELETE ITEM
router.get('/:item/delete', itemController.deleteGET);

//GET ITEM PAGE
router.use('/:item', itemController.get);

module.exports = router;