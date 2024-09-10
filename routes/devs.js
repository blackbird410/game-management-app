const express = require('express');
const router = express.Router();
const checkAdmin = require('../middleware/checkAdmin');
const authenticateJWT = require('../middleware/auth');

const dev_controller = require('../controllers/devController');

// Route to render the index page
router.get('/', authenticateJWT, checkAdmin, dev_controller.renderIndex);
router.get('/add', authenticateJWT, checkAdmin, dev_controller.addDeveloperGet);
router.post('/add', authenticateJWT, checkAdmin, dev_controller.addDeveloperPost);
router.get('/:id/edit', authenticateJWT, checkAdmin, dev_controller.editDeveloperGet);
router.post('/:id/edit', authenticateJWT, checkAdmin, dev_controller.editDeveloperPost);
router.get('/:id/delete', authenticateJWT, checkAdmin, dev_controller.deleteDeveloperGet);
router.post('/:id/delete', authenticateJWT, checkAdmin, dev_controller.deleteDeveloperPost);

module.exports = router;

