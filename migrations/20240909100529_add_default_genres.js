
exports.up = function(knex) {
  return knex('genre').insert([
    { name: 'Action' },
    { name: 'Adventure' },
    { name: 'Role-Playing' },
    { name: 'Strategy' },
    { name: 'Simulation' },
    { name: 'Sports' },
    { name: 'Puzzle' },
    { name: 'Racing' },
    { name: 'Shooter' },
    { name: 'Horror' }
  ]);
};

exports.down = function(knex) {
  return knex('genre').del()
    .whereIn('name', [
      'Action', 
      'Adventure', 
      'Role-Playing', 
      'Strategy', 
      'Simulation', 
      'Sports', 
      'Puzzle', 
      'Racing', 
      'Shooter', 
      'Horror'
    ]);
};

