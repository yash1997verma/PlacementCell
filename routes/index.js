const express = require('express');
const router  = express.Router();

//home router
router.use('/', require('./home'));


module.exports = router;