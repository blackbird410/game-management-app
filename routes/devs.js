const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');

const dev_controller = require('../controllers/devController');

// Route to render the index page
router.get('/', authenticateJWT ,dev_controller.renderIndex);
router.get('/add', dev_controller.addDeveloperGet);
router.post('/add', dev_controller.addDeveloperPost);
router.get('/:id/edit', dev_controller.editDeveloperGet);
router.post('/:id/edit', dev_controller.editDeveloperPost);
router.get('/:id/delete', dev_controller.deleteDeveloperGet);
router.post('/:id/delete', dev_controller.deleteDeveloperPost);

module.exports = router;

