

exports.up = function(knex) {
  return knex.schema.alterTable('games', function(table) {
    // Drop existing foreign key constraints
    table.dropForeign('genre_id');
    table.dropForeign('developer_id');
    
    // Add new foreign key constraints referencing the new table names
    table.foreign('genre_id').references('id').inTable('genres');
    table.foreign('developer_id').references('id').inTable('developers');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('games', function(table) {
    // Drop the new foreign key constraints
    table.dropForeign('genre_id');
    table.dropForeign('developer_id');
    
    // Re-add the old foreign key constraints referencing the old table names
    table.foreign('genre_id').references('id').inTable('genre');
    table.foreign('developer_id').references('id').inTable('developer');
  });
};

