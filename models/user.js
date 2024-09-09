// models/user.js
require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('../knexfile')[environment];
const knex = require('knex')(knexConfig);

const getAllUsers = async () => {
  try {
    return await knex('users');
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    return await knex('users').where({ id }).first();
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    return await knex('users').where({ email }).first();
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

const addUser = async (user) => {
  try {
    if (!user.name || !user.email || !user.password_hash) {
      throw new Error('User object is missing required fields');
    }
    return await knex('users').insert(user);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

const updateUserById = async (id, userUpdates) => {
  try {
    return await knex('users').where({ id }).update(userUpdates);
  } catch (error) {
    console.error('Error updating user by ID:', error);
    throw error;
  }
};

const deleteUserById = async (id) => {
  try {
    return await knex('users').where({ id }).del();
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  addUser,
  updateUserById,
  deleteUserById,
};
