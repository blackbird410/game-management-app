const express = require('express');
const router = express.Router();
const game_controller = require('../controllers/gameController');

// Route to render the index page
router.get('/', game_controller.renderIndex);
router.get('/add-game', game_controller.addGameGet);
router.post('/add-game', game_controller.addGamePost);

module.exports = router;
