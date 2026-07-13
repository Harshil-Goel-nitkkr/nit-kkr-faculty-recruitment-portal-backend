// routes/profile.routes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controller/profile.controller');
const { protectUser } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.use(protectUser);

router.get('/', profileController.getMyProfile);
router.put('/', profileController.updateMyProfile);
router.post('/resume', upload.single('resume'), profileController.uploadResume);

module.exports = router;
