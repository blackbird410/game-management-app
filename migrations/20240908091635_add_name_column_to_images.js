
exports.up = function(knex) {
  return knex.schema.table('images', function(table) {
    table.string('name'); // Add the name column
  });
};

exports.down = function(knex) {
  return knex.schema.table('images', function(table) {
    table.dropColumn('name'); // Remove the name column if rolled back
  });
};

