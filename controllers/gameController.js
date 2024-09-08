
const multer = require('multer');
const { body, validationResult } = require('express-validator');

const { getAllGames, addGame } = require('../models/game');
const { addImageToBucket, getImageSignedUrl } = require('../lib/awsUtils');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Render the index page with games data
const renderIndex = async (req, res) => {
  try {
    const games = await getAllGames();

    for (const game of games) {
      game.image_url = getImageSignedUrl(game.image_key);
    }

    res.render('index', { games });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Render the page for adding a new game
const addGameGet = async (req, res) => {
  try {
    const games = await getAllGames();
    res.render('add_game', { games });
  } catch (error) {
    console.error('Error fetching games for add game page:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Handle the submission of a new game
const addGamePost = [
  // Validate and sanitize input
  upload.single('image'),
  body('title').isString().trim().notEmpty().withMessage('Title is required'),
  body('description').isString().trim().notEmpty().withMessage('Description is required'),
  body('genre').isString().trim().notEmpty().withMessage('Genre is required'),
  body('release_date').isDate().withMessage('Release date must be a valid date'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('add_game', { 
        errors: errors.array() 
      });
    }

    try {
      const game = req.body;

      console.log(req.file);
      if (req.file) game.image_key = await addImageToBucket(req.file.buffer, req.file.mimetype, req.file.originalname);

      await addGame(game);
      res.redirect('/');
    } catch (error) {
      console.error('Error adding game:', error);
      res.status(500).send('Internal Server Error');
    }
  }
];

module.exports = { 
  renderIndex, 
  addGameGet,
  addGamePost,
};

