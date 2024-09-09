const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');

const user_controller = require('../controllers/userController');

// Route to render the index page
router.get('/', authenticateJWT ,user_controller.renderIndex);
router.get('/register', user_controller.registerGet);
router.post('/register', user_controller.registerPost);
router.get('/login', user_controller.loginGet);
router.post('/login', user_controller.loginPost);
router.post('/logout', user_controller.logout);

module.exports = router;
