const Game = require('../models/game');

// Render the index page with games data
const renderIndex = async (req, res) => {
  try {
    const games = await Game.getAllGames();
    res.render('index', { games });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

const add_game_get = async (req, res) => {
    const games = await Game.getAllGames();
    res.render('add_game', { games });
};

const add_game_post = async (req, res) => {
  try {
    const game = req.body;
    await Game.addGame(game);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { 
  renderIndex, 
  add_game_get,
  add_game_post,
};

