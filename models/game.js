const { Pool } = require('pg');
require('dotenv').config();

// Configure your database connection
const pool = new Pool({
  user: process.env.DB_ROLE, 
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS, 
  port: process.env.DB_PORT,
  ssl: false, // Enable SSL if needed
});

const getAllGames = async () => {
  try {
    const result = await pool.query('SELECT * FROM games');
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const addGame = async (game) => {
  try {
    const query = {
      text: 'INSERT INTO games (title, genre, release_date) VALUES ($1, $2, $3)',
      values: [game.title, game.genre, game.release_date],
    };
    await pool.query(query);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

module.exports = { 
  getAllGames,
  addGame,
};

