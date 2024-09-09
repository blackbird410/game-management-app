
exports.up = function(knex) {
  return knex.schema.createTable('purchase_history', function(table) {
    table.increments('id').primary(); // Unique identifier
    table.integer('user_id').unsigned().notNullable(); // Foreign key referencing user
    table.integer('game_id').unsigned().notNullable(); // Foreign key referencing game
    table.date('purchase_date').notNullable(); // Date of purchase
    table.integer('quantity').unsigned().notNullable(); // Number of copies purchased

    // Add foreign key constraints (adjust table names if they differ)
    table.foreign('user_id').references('id').inTable('users');
    table.foreign('game_id').references('id').inTable('games');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('purchase_history');
};

