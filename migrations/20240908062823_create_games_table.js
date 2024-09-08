/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('games', function(table) {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.date('release_date');
    table.string('genre');
    table.string('image_key');
    table.string('image_url');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('games');
};


