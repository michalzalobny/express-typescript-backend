const express = require('express')

const router = express.Router() // instead of app.get, we use router.get
const pageFormController = require('../controllers/pageFormController')

// const checkAuth = require('../middleware/check-auth');
// const checkAuthSuperuser = require('../middleware/check-auth-superuser');
// const checkAuthAdmin = require('../middleware/chech-auth-admin');

router.post('/postpageform', pageFormController.postPageForm)

module.exports = router
