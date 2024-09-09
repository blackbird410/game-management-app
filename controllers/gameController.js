
const multer = require('multer');
const { body, validationResult } = require('express-validator');

const { 
  addGame,
  getAllGames, 
  getGameById,
  updateGameById,
  deleteGameById,
} = require('../models/game');

const { 
  addImageToBucket, 
  getImageSignedUrl, 
  deleteImage 
} = require('../lib/awsUtils');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Render the index page with games data
const renderIndex = async (req, res) => {
  try {
    const games = await getAllGames();

    for (const game of games) {
      game.image_url = getImageSignedUrl(game.image_key);
    }

    res.render('game_collection', {
      title: "Game Collection",
      games: games
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Render the page for adding a new game
const addGameGet = async (req, res) => {
  try {
    res.render('form_game', { game: null });
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
      return res.status(400).render('form_game', { 
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

const editGameGet = async (req, res) => {
  try {
    const game = await getGameById(req.params.id);
    if (!game) {
      return res.status(404).send('Game not found');
    }

    res.render('form_game', { game });
  } catch (error) {
    console.error('Error fetching game for edit page:', error);
    res.status(500).send('Internal Server Error');
  }
}

const editGamePost = [
  // Validate and sanitize input
  upload.single('image'),
  body('title').isString().trim().notEmpty().withMessage('Title is required'),
  body('description').isString().trim().notEmpty().withMessage('Description is required'),
  body('genre').isString().trim().notEmpty().withMessage('Genre is required'),
  body('release_date').isDate().withMessage('Release date must be a valid date'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('edit_game', { 
        errors: errors.array() 
      });
    }

    try {
      const game = req.body;

      if (req.file) game.image_key = await addImageToBucket(req.file.buffer, req.file.mimetype, req.file.originalname);

      await updateGameById(req.params.id, game);
      res.redirect('/');
    } catch (error) {
      console.error('Error updating game:', error);
      res.status(500).send('Internal Server Error');
    }
  }
];

const deleteGameGet = async(req, res) => {
  try {
    const game = await getGameById(req.params.id);
    if (!game) {
      return res.status(404).send('Game not found');
    }

    res.render('delete_game', { game });
  } catch (error) {
    console.error('Error fetching game for delete page:', error);
    res.status(500).send('Internal Server Error');
  }
};

const deleteGamePost = async(req, res) => {
  try {
    const game = await getGameById(req.params.id);
    if (!game) {
      return res.status(404).send('Game not found');
    }

    if (game.image_key) {
      await deleteImage(game.image_key);
    }

    await deleteGameById(req.params.id);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { 
  renderIndex, 
  addGameGet,
  addGamePost,
  editGameGet,
  editGamePost,
  deleteGameGet,
  deleteGamePost,
};

