exports.up = function (knex) {
  return Promise.all([
    knex.schema.table('games', function (table) {
      table.text('description').alter();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.table('games', function (table) {
      table.string('description', 255).alter();
    }),
  ]);
};

