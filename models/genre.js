// models/genre.js
require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('../knexfile')[environment];
const knex = require('knex')(knexConfig);

const getAllGenres = async () => {
  try {
    return await knex('genres').select('*');
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

const getGenreById = async (id) => {
  try {
    return await knex('genres').where({ id }).first();
  } catch (error) {
    console.error('Error fetching genre by ID:', error);
    throw error;
  }
};

const getGenreByName = async (name) => {
  try {
    return await knex('genres').where({ name }).first();
  } catch (error) {
    console.error('Error fetching genre by name:', error);
    throw error;
  }
};

const addGenre = async (genre) => {
  try {
    if (!genre.name) {
      throw new Error('Genre object is missing required fields');
    }
    return await knex('genres').insert(genre);
  } catch (error) {
    console.error('Error adding genre:', error);
    throw error;
  }
};

const updateGenreById = async (id, genreUpdates) => {
  try {
    return await knex('genres').where({ id }).update(genreUpdates);
  } catch (error) {
    console.error('Error updating genre by ID:', error);
    throw error;
  }
};

const deleteGenreById = async (id) => {
  try {
    return await knex('genres').where({ id }).del();
  } catch (error) {
    console.error('Error deleting genre by ID:', error);
    throw error;
  }
};

module.exports = { 
  getAllGenres, 
  getGenreById, 
  getGenreByName, 
  addGenre, 
  updateGenreById, 
  deleteGenreById 
};
