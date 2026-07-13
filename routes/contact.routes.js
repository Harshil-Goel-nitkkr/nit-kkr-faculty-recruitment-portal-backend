// routes/contact.routes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controller/contact.controller');

router.post('/', contactController.sendContactMail);

module.exports = router;
