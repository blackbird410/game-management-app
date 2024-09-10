exports.up = function(knex) {
  return knex.schema
    // Step 1: Rename the existing table
    .raw('ALTER TABLE purchase_history RENAME TO old_purchase_history')
    .then(function() {
      // Step 2: Create a new table with the updated schema
      return knex.schema.createTable('purchase_history', function(table) {
        table.increments('id').primary();
        table.integer('user_id').notNullable();
        table.integer('game_id').notNullable();
        table.timestamp('purchase_date').notNullable();
        table.integer('quantity').notNullable();
        table.float('price').unsigned().notNullable().defaultTo(0); // Updated to float with default value
      });
    });
};

exports.down = function(knex) {
  return knex.schema
    // Step 1: Create the old table structure
    .createTable('old_purchase_history', function(table) {
      table.increments('id').primary();
      table.integer('user_id').notNullable();
      table.integer('game_id').notNullable();
      table.timestamp('purchase_date').notNullable();
      table.integer('quantity').notNullable();
      table.integer('price').unsigned().notNullable(); // Revert to integer
    })
    .then(function() {
      // Step 2: Insert data into the old table
      return knex('purchase_history').select('*');
    })
    .then(function(rows) {
      // Insert data into the old table
      return knex('old_purchase_history').insert(rows.map(row => ({
        id: row.id,
        user_id: row.user_id,
        game_id: row.game_id,
        purchase_date: row.purchase_date,
        quantity: row.quantity,
        price: row.price, // Convert float to integer if needed
      })));
    })
    .then(function() {
      // Drop the new table
      return knex.schema.dropTable('purchase_history');
    })
    .then(function() {
      // Rename the old table back to the original name
      return knex.schema.raw('ALTER TABLE old_purchase_history RENAME TO purchase_history');
    });
};

