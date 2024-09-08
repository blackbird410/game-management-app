// models/game.js

// Import Knex configuration
const knex = require('knex')(require('../knexfile').development); // Adjust as needed for your environment

// Function to get all games from the database
const getAllGames = async () => {
  try {
    return await knex('games').select('*');
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

// Function to add a new game to the database
const addGame = async (game) => {
  try {
    // Ensure the game object has the required fields before inserting
    if (!game.title || !game.genre || !game.release_date) {
      throw new Error('Game object is missing required fields');
    }
    return await knex('games').insert(game);
  } catch (error) {
    console.error('Error adding game:', error);
    throw error;
  }
};

// Function to get a game by ID
const getGameById = async (id) => {
  try {
    return await knex('games').where({ id }).first();
  } catch (error) {
    console.error('Error fetching game by ID:', error);
    throw error;
  }
};

// Function to update a game by ID
const updateGameById = async (id, gameUpdates) => {
  try {
    return await knex('games').where({ id }).update(gameUpdates);
  } catch (error) {
    console.error('Error updating game by ID:', error);
    throw error;
  }
};

// Function to delete a game by ID
const deleteGameById = async (id) => {
  try {
    return await knex('games').where({ id }).del();
  } catch (error) {
    console.error('Error deleting game by ID:', error);
    throw error;
  }
};

// Export the functions for use in other parts of the application
module.exports = { getAllGames, addGame, getGameById, updateGameById, deleteGameById };

