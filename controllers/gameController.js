const { getAllGames, addGame } = require('../models/game');
const { body, validationResult } = require('express-validator');

// Render the index page with games data
const renderIndex = async (req, res) => {
  try {
    const games = await getAllGames();
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
  body('title').isString().trim().notEmpty().withMessage('Title is required'),
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

