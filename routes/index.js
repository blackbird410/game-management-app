const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');

const game_controller = require('../controllers/gameController');
const user_controller = require('../controllers/userController');
const checkAdmin = require('../middleware/checkAdmin');

// Route to render the index page
router.get('/', game_controller.renderIndex);
router.get('/home', game_controller.renderIndex);

router.get('/profile', authenticateJWT, user_controller.renderProfile);
router.post('/profile/update', authenticateJWT, user_controller.updateUserPost);
router.post ('/profile/password', authenticateJWT, user_controller.updatePassword);

router.get('/games', game_controller.renderIndex);
router.get('/add-game', authenticateJWT, checkAdmin, game_controller.addGameGet);
router.post('/add-game', authenticateJWT, checkAdmin, game_controller.addGamePost);
router.get('/edit-game/:id', authenticateJWT, checkAdmin, game_controller.editGameGet);
router.post('/edit-game/:id', authenticateJWT, checkAdmin, game_controller.editGamePost);
router.get('/delete-game/:id', authenticateJWT, checkAdmin, game_controller.deleteGameGet);
router.post('/delete-game/:id', authenticateJWT, checkAdmin, game_controller.deleteGamePost);

router.get('/add-admin', authenticateJWT, checkAdmin, user_controller.addAdminGet);
router.post('/add-admin', authenticateJWT, checkAdmin, user_controller.addAdminPost);

router.get('/add-to-cart/:id', authenticateJWT, game_controller.addToCartGet);
router.post('/add-to-cart/:id', authenticateJWT, game_controller.addToCartPost);
// router.get('/cart', authenticateJWT, game_controller.renderCart);

router.get('/register', user_controller.registerGet);
router.post('/register', user_controller.registerPost);
router.get('/login', user_controller.loginGet);
router.post('/login', user_controller.loginPost);
router.get('/logout', user_controller.logout);
router.post('/logout', user_controller.logout);

module.exports = router;
