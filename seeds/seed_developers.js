exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('developers').del()
    .then(function () {
      // Inserts seed entries
      return knex('developers').insert([
        { name: 'Valve', location: 'Bellevue, Washington' },
        { name: 'Rockstar Games', location: 'New York City, New York' },
        { name: 'CD Projekt Red', location: 'Warsaw, Poland' },
        { name: 'Naughty Dog', location: 'Santa Monica, California' },
        { name: 'Ubisoft', location: 'Montreuil, France' },
        { name: 'Bungie', location: 'Bellevue, Washington' },
        { name: 'Bethesda Game Studios', location: 'Rockville, Maryland' },
        { name: 'Square Enix', location: 'Tokyo, Japan' },
      ]);
    });
};

