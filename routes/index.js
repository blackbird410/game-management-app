const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');

const game_controller = require('../controllers/gameController');
const user_controller = require('../controllers/userController');

// Route to render the index page
router.get('/', game_controller.renderFilteredIndex);
router.post('/', game_controller.renderFilteredIndex);
router.get('/home', (req, res) => res.redirect('/'));

router.get('/profile', authenticateJWT, user_controller.renderProfile);
router.post('/profile/update', authenticateJWT, user_controller.updateUserPost);
router.post ('/profile/password', authenticateJWT, user_controller.updatePassword);

router.get('/games', (req, res) => res.redirect('/'));
router.post('/games', (req, res) => res.redirect('/'));

router.get('/add-to-cart/:id', authenticateJWT, game_controller.addToCartGet);
router.post('/add-to-cart/:id', authenticateJWT, game_controller.addToCartPost);
router.get('/purchases', authenticateJWT, user_controller.renderPurchaseHistory);

router.get('/register', user_controller.registerGet);
router.post('/register', user_controller.registerPost);
router.get('/login', user_controller.loginGet);
router.post('/login', user_controller.loginPost);
router.get('/logout', user_controller.logout);
router.post('/logout', user_controller.logout);

module.exports = router;
