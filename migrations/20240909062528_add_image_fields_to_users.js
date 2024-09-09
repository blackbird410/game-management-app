
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('image_key').nullable();   // Allows storing the image key (e.g., from AWS S3)
    table.string('image_url').nullable();   // Allows storing the image URL (public URL)
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('image_key');
    table.dropColumn('image_url');
  });
};

