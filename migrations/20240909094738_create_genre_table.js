
exports.up = function(knex) {
  return knex.schema.createTable('genre', function(table) {
    table.increments('id').primary(); // Unique identifier
    table.string('name').notNullable(); // Genre name
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('genre');
};

