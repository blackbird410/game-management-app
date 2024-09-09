const express = require('express');
const router = express.Router();
const game_controller = require('../controllers/gameController');

// Route to render the index page
router.get('/', game_controller.renderIndex);
router.get('/games', game_controller.renderIndex);
router.get('/add-game', game_controller.addGameGet);
router.post('/add-game', game_controller.addGamePost);
router.get('/edit-game/:id', game_controller.editGameGet);
router.post('/edit-game/:id', game_controller.editGamePost);
router.get('/delete-game/:id', game_controller.deleteGameGet);
router.post('/delete-game/:id', game_controller.deleteGamePost);

module.exports = router;
