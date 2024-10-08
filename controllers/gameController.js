
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const { 
  isAdmin,
  getUserData
} = require('../middleware/checkAdmin');

const { 
  addGame,
  getAllGames, 
  getGameById,
  getGamesByGenre,
  getGamesByDeveloper,
  getGamesByGenreDeveloper,
  updateGameById,
  deleteGameById,
} = require('../models/game');

const { getAllGenres } = require('../models/genre');
const { getAllDevelopers } = require('../models/developer');
const { addPurchaseHistory } = require('../models/purchase_history');

const { 
  addImageToBucket, 
  getImageSignedUrl, 
  deleteImage 
} = require('../lib/awsUtils');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const renderIndex = asyncHandler(async (req, res) => {
  const { genre_id, developer_id } = req.body;

  let games;

  if (genre_id && developer_id) {
    games = await getGamesByGenreDeveloper(genre_id, developer_id);
  } else if (genre_id) {
    games = await getGamesByGenre(genre_id);
  } else if (developer_id) {
    games = await getGamesByDeveloper(developer_id);
  } else {
    games = await getAllGames();
  }

  for (const game of games) {
    game.image_url = getImageSignedUrl(game.image_key);
  }

  const genres = await getAllGenres();
  const developers = await getAllDevelopers();

  res.render('game_collection', {
    title: "Game Collection",
    user: getUserData(req),
    games: games,
    genres: genres,
    developers: developers,
    selectedGenre: genre_id,
    selectedDeveloper: developer_id,
    is_admin: isAdmin(req)
  });
});

const renderGames = async (req, res) => {
  try {
    const games = await getAllGames();
    const genres = await getAllGenres();
    const developers = await getAllDevelopers();

    for (const game of games) {
      game.image_url = getImageSignedUrl(game.image_key);
    }

    const user = getUserData(req);

    res.render('games', {
      title: "Game Collection",
      user,
      games: games,
      genres: genres,
      devs: developers,
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Render the page for adding a new game
const addGameGet = async (req, res) => {
  try {
    const allGenres = await getAllGenres();
    const allDevelopers = await getAllDevelopers();

    res.render('form_game', { 
      title: 'Add New Game',
      user: req.user,
      genres: allGenres,
      game: null,
      developers: allDevelopers
    });
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
  body('genre_id').isInt().withMessage('Genre ID must be an integer'),
  body('developer_id').isInt().withMessage('Developer ID must be an integer'),
  body('release_date').isDate().withMessage('Release date must be a valid date'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('form_game', { 
        errors: errors.array(),
        game: req.body,
        user: req.user
      });
    }

    try {
      const game = req.body;

      if (req.file) {
        try {
          game.image_key = await addImageToBucket(req.file.buffer, req.file.mimetype, req.file.originalname);
        } catch (error) {
          console.error('Error uploading game image:', error);
          return res.status(500).send('Internal Server Error');
        }
      }

      await addGame(game);
      res.redirect('/admin/games');
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
    
    const genres = await getAllGenres();
    const developers = await getAllDevelopers();

    res.render('form_game', { game, genres, developers, user: req.user });
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
  body('genre_id').isInt().withMessage('Genre ID must be an integer'),
  body('developer_id').isInt().withMessage('Developer ID must be an integer'),
  body('release_date').isDate().withMessage('Release date must be a valid date'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('form_game', { 
        errors: errors.array(),
        game: req.body,
        user: req.user
      });
    }

    try {
      const game = req.body;

      if (req.file) {
        try {
          game.image_key = await addImageToBucket(req.file.buffer, req.file.mimetype, req.file.originalname);
        } catch (error) {
          console.error('Error uploading game image:', error);
          return res.status(500).send('Internal Server Error');
        }
      }

      await updateGameById(req.params.id, game);
      res.redirect('/admin/games');
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

    res.render('delete_game', { game, user: req.user });
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
    res.redirect('/admin/games');
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).send('Internal Server Error');
  }
};

const addToCartGet = async (req, res) => {
  const game = await getGameById(req.params.id);
  return res.render('add_to_cart', { game, user: req.user });
};

const addToCartPost = async (req, res) => {
  try {
    const game = await getGameById(req.params.id);
    if (!game) {
      return res.status(404).send('Game not found');
    }

    const purchaseHistory = {
      user_id: req.user.id,
      game_id: game.id,
      purchase_date: new Date().toISOString(),
      quantity: req.body.quantity,
      price: game.price
    };

    await addPurchaseHistory(purchaseHistory);
    res.redirect('/');
  } catch (error) {
    console.error('Error adding game to cart:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { 
  renderIndex, 
  renderGames,
  addGameGet,
  addGamePost,
  editGameGet,
  editGamePost,
  deleteGameGet,
  deleteGamePost,
  addToCartGet,
  addToCartPost,
};

