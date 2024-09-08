const { Pool } = require('pg');
require('dotenv').config();

// Configure your database connection
const pool = new Pool({
  user: process.env.DB_USER, 
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS, 
  port: process.env.DB_PORT,
  ssl: false, // Enable SSL if needed
});

module.exports = pool;
