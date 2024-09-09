const express = require('express');
const router = express.Router();
const game_controller = require('../controllers/gameController');
const user_controller = require('../controllers/userController');

// Route to render the index page
router.get('/', game_controller.renderIndex);
router.get('/games', game_controller.renderIndex);
router.get('/add-game', game_controller.addGameGet);
router.post('/add-game', game_controller.addGamePost);
router.get('/edit-game/:id', game_controller.editGameGet);
router.post('/edit-game/:id', game_controller.editGamePost);
router.get('/delete-game/:id', game_controller.deleteGameGet);
router.post('/delete-game/:id', game_controller.deleteGamePost);

router.get('/add-admin', user_controller.addAdminGet);
router.post('/add-admin', user_controller.addAdminPost);

router.get('/register', user_controller.registerGet);
router.post('/register', user_controller.registerPost);
router.get('/login', user_controller.loginGet);
router.post('/login', user_controller.loginPost);
router.get('/logout', user_controller.logout);
router.post('/logout', user_controller.logout);

module.exports = router;
