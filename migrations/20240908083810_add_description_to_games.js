
exports.up = function(knex) {
  return knex.schema.table('games', function(table) {
    table.text('description'); // Adding the description column
  });
};

exports.down = function(knex) {
  return knex.schema.table('games', function(table) {
    table.dropColumn('description'); // Reverting the changes if needed
  });
};

