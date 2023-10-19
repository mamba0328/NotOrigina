var express = require('express');
var router = express.Router();


const categoriesController = require('../controllers/categoriesController');


//CATEGORY CREATE GET/POST
router.get('/category/create',  categoriesController.createGET);

router.post('/category/create',  categoriesController.createPOST);

//CATEGORY DELETE
router.get('/category/:id/delete',  categoriesController.deleteGET);

//CATEGORY PAGE
router.get('/category/:category', categoriesController.get);

module.exports = router;
