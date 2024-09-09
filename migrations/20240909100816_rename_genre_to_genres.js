
// Filename: xxxxxx_rename_genre_to_genres.js

exports.up = function(knex) {
  return knex.schema.renameTable('genre', 'genres');
};

exports.down = function(knex) {
  return knex.schema.renameTable('genres', 'genre');
};

