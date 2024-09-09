
exports.up = function(knex) {
  return knex.schema.createTable('developer', function(table) {
    table.increments('id').primary(); // Unique identifier
    table.string('name').notNullable(); // Developer name
    table.string('location'); // Developer location
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('developer');
};

