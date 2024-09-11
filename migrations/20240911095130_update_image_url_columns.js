exports.up = function (knex) {
  return Promise.all([
    knex.schema.table('games', function (table) {
      table.text('image_url').alter();
    }),
    knex.schema.table('developers', function (table) {
      table.text('image_url').alter();
    }),
    knex.schema.table('users', function (table) {
      table.text('image_url').alter();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.table('games', function (table) {
      table.string('image_url', 255).alter();
    }),
    knex.schema.table('developers', function (table) {
      table.string('image_url', 255).alter();
    }),
    knex.schema.table('users', function (table) {
      table.string('image_url', 255).alter();
    }),
  ]);
};

