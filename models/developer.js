// models/developer.js
require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('../knexfile')[environment];
const knex = require('knex')(knexConfig);

// Function to get all developers
const getAllDevelopers = async () => {
  try {
    return await knex('developers').select('*');
  } catch (error) {
    console.error('Error fetching developers:', error);
    throw error;
  }
};

// Function to add a new developer to the database
const addDeveloper = async (developer) => {
  try {
    if (!developer.name || !developer.location) {
      throw new Error('Developer object is missing required fields');
    }
    return await knex('developers').insert(developer);
  } catch (error) {
    console.error('Error adding developer:', error);
    throw error;
  }
};

// Function to get a developer by ID
const getDeveloperById = async (id) => {
  try {
    return await knex('developers').where({ id }).first();
  } catch (error) {
    console.error('Error fetching developer by ID:', error);
    throw error;
  }
};

// Function to update a developer by ID
const updateDeveloperById = async (id, developerUpdates) => {
  try {
    return await knex('developers').where({ id }).update(developerUpdates);
  } catch (error) {
    console.error('Error updating developer by ID:', error);
    throw error;
  }
};

// Function to delete a developer by ID
const deleteDeveloperById = async (id) => {
  try {
    return await knex('developers').where({ id }).del();
  } catch (error) {
    console.error('Error deleting developer by ID:', error);
    throw error;
  }
};

module.exports = { 
  getAllDevelopers, 
  addDeveloper, 
  getDeveloperById, 
  updateDeveloperById, 
  deleteDeveloperById,
};
