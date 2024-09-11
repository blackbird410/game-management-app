
exports.up = async function (knex) {
  const columnExists = await knex.schema.hasColumn('images', 'name');
  if (!columnExists) {
    return knex.schema.table('images', function (table) {
      table.string('name', 255);
    });
  }
};

exports.down = function (knex) {
  return knex.schema.table('images', function (table) {
    table.dropColumn('name');
  });
};

