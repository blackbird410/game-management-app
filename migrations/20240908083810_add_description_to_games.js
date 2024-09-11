
exports.up = async function (knex) {
  const columnExists = await knex.schema.hasColumn('games', 'description');
  if (!columnExists) {
    return knex.schema.table('games', function (table) {
      table.text('description');
    });
  }
};

exports.down = function (knex) {
  return knex.schema.table('games', function (table) {
    table.dropColumn('description');
  });
};

