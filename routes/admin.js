const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');

const game_controller = require('../controllers/gameController');
const user_controller = require('../controllers/userController');
const dev_controller = require('../controllers/devController');
const { checkAdmin } = require('../middleware/checkAdmin');

router.get('/dashboard', authenticateJWT, checkAdmin, user_controller.renderAdminDashboard);

router.get('/games/add', authenticateJWT, checkAdmin, game_controller.addGameGet);
router.post('/games/add', authenticateJWT, checkAdmin, game_controller.addGamePost);

router.get('/add', authenticateJWT, checkAdmin, user_controller.addAdminGet);
router.post('/add', authenticateJWT, checkAdmin, user_controller.addAdminPost);

router.get('/games/:id/edit', authenticateJWT, checkAdmin, game_controller.editGameGet);
router.post('/games/:id/edit', authenticateJWT, checkAdmin, game_controller.editGamePost);
router.get('/games/:id/delete', authenticateJWT, checkAdmin, game_controller.deleteGameGet);
router.post('/games/:id/delete', authenticateJWT, checkAdmin, game_controller.deleteGamePost);

router.get('/devs', authenticateJWT, checkAdmin, dev_controller.renderIndex);
router.get('/devs/add', authenticateJWT, checkAdmin, dev_controller.addDeveloperGet);
router.post('/devs/add', authenticateJWT, checkAdmin, dev_controller.addDeveloperPost);
router.get('/devs/:id/edit', authenticateJWT, checkAdmin, dev_controller.editDeveloperGet);
router.post('/devs/:id/edit', authenticateJWT, checkAdmin, dev_controller.editDeveloperPost);
router.get('/devs/:id/delete', authenticateJWT, checkAdmin, dev_controller.deleteDeveloperGet);
router.post('/devs/:id/delete', authenticateJWT, checkAdmin, dev_controller.deleteDeveloperPost);

router.get('/users', authenticateJWT, checkAdmin, user_controller.renderIndex);

module.exports = router;
