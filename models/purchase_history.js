// models/purchase_history.js
require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('../knexfile')[environment];
const knex = require('knex')(knexConfig);

// Function to get all purchase history from the database
const getAllPurchaseHistory = async () => {
  try {
    return await knex('purchase_history').select('*');
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    throw error;
  }
};

const getUserPurchaseHistory = async (user_id) => {
  try {
    return await knex('purchase_history').where({ user_id });
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    throw error;
  }
};

const getGamePurchaseHistory = async (game_id) => {
  try {
    return await knex('purchase_history').where({ game_id });
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    throw error;
  }
};

const getPurchaseHistoryByDate = async (date) => {
  try {
    return await knex('purchase_history').where({ purchase_date });
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    throw error;
  }
};

// Function to add a new purchase history to the database
const addPurchaseHistory = async (purchaseHistory) => {
  try {
    if (!purchaseHistory.user_id || !purchaseHistory.game_id || !purchaseHistory.purchase_date) {
      throw new Error('Purchase history object is missing required fields');
    }
    return await knex('purchase_history').insert(purchaseHistory);
  } catch (error) {
    console.error('Error adding purchase history:', error);
    throw error;
  }
};

// Function to get purchase history by ID
const getPurchaseHistoryById = async (id) => {
  try {
    return await knex('purchase_history').where({ id }).first();
  } catch (error) {
    console.error('Error fetching purchase history by ID:', error);
    throw error;
  }
};

// Function to update purchase history by ID
const updatePurchaseHistoryById = async (id, purchaseHistoryUpdates) => {
  try {
    return await knex('purchase_history').where({ id }).update(purchaseHistoryUpdates);
  } catch (error) {
    console.error('Error updating purchase history by ID:', error);
    throw error;
  }
};

// Function to delete purchase history by ID
const deletePurchaseHistoryById = async (id) => {
  try {
    return await knex('purchase_history').where({ id }).del();
  } catch (error) {
    console.error('Error deleting purchase history by ID:', error);
    throw error;
  }
};

module.exports = { 
  getAllPurchaseHistory,
  getUserPurchaseHistory,
  getGamePurchaseHistory,
  getPurchaseHistoryByDate,
  getPurchaseHistoryById,
  addPurchaseHistory,
  updatePurchaseHistoryById,
  deletePurchaseHistoryById
};
