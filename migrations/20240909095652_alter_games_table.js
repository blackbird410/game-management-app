
exports.up = async function(knex) {
  // Step 1: Add the column with a default value
  await knex.schema.table('games', function(table) {
    table.integer('genre_id').unsigned().defaultTo(1); // or any default value suitable for your data
    table.integer('developer_id').unsigned().defaultTo(1); // similar default
    table.string('platform');
    table.decimal('price', 10, 2).defaultTo(0);
    table.integer('stock').unsigned().defaultTo(0);
  });

  // Step 2: Update existing data if needed (use appropriate default values)
  await knex('games').update({
    genre_id: 1, // Use valid IDs as default values
    developer_id: 1,
  });

  // Step 3: Alter the column to be NOT NULL
  await knex.schema.table('games', function(table) {
    table.integer('genre_id').unsigned().notNullable().alter();
    table.integer('developer_id').unsigned().notNullable().alter();
  });

  // Step 4: Add foreign key constraints
  await knex.schema.table('games', function(table) {
    table.foreign('genre_id').references('id').inTable('genre');
    table.foreign('developer_id').references('id').inTable('developer');
  });

  // Remove the old genre column
  await knex.schema.table('games', function(table) {
    table.dropColumn('genre');
  });
};

exports.down = async function(knex) {
  // Re-add dropped column
  await knex.schema.table('games', function(table) {
    table.string('genre');
  });

  // Remove foreign key constraints
  await knex.schema.table('games', function(table) {
    table.dropForeign('genre_id');
    table.dropForeign('developer_id');
  });

  // Drop new columns
  await knex.schema.table('games', function(table) {
    table.dropColumn('genre_id');
    table.dropColumn('developer_id');
    table.dropColumn('platform');
    table.dropColumn('price');
    table.dropColumn('stock');
  });
};

