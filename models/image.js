// models/image.js
require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('../knexfile')[environment];
const knex = require('knex')(knexConfig);

const getImageByKey = async (key) => {
  try {
    return await knex('images').where({ key }).first();
  } catch (error) {
    console.error('Error fetching image by key:', error);
    throw error;
  }
};

const getImageById = async (id) => {
  try {
    return await knex('images').where({ id }).first();
  } catch (error) {
    console.error('Error fetching image by ID:', error);
    throw error;
  }
}

const addImage = async (image) => {
  try {
    if (!image.key || !image.name) {
      throw new Error('Image object is missing required fields');
    }
    return await knex('images').insert(image);
  } catch (error) {
    console.error('Error adding image:', error);
    throw error;
  }
};

const updateImageById = async (id, imageUpdates) => {
  try {
    return await knex('images').where({ id }).update(imageUpdates);
  } catch (error) {
    console.error('Error updating image by ID:', error);
    throw error;
  }
};

const deleteImageById = async (id) => {
  try {
    return await knex('images').where({ id }).del();
  } catch (error) {
    console.error('Error deleting image by ID:', error);
    throw error;
  }
};

const deleteImageByKey = async (key) => {
  try {
    return await knex('images').where({ key }).del();
  } catch (error) {
    console.error('Error deleting image by key:', error);
    throw error;
  }
};

module.exports = {
  getImageByKey,
  getImageById,
  addImage,
  updateImageById,
  deleteImageById,
  deleteImageByKey,
};
