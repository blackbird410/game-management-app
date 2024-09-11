exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('purchase_history').del();
  await knex('old_purchase_history').del();
  await knex('games').del();
  await knex('developers').del();
  await knex('genres').del();
  await knex('users').del();
  await knex('images').del();

  // Insert sample images
  await knex('images').insert([
    { key: 'game1-img', url: 'https://example.com/images/game1.jpg', name: 'Game 1 Cover' },
    { key: 'game2-img', url: 'https://example.com/images/game2.jpg', name: 'Game 2 Cover' },
    { key: 'dev1-img', url: 'https://example.com/images/dev1.jpg', name: 'Developer 1' },
    { key: 'user1-img', url: 'https://example.com/images/user1.jpg', name: 'User 1 Avatar' },
  ]);

  // Insert sample users
  await knex('users').insert([
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password_hash: 'hashed_password_1',
      password_salt: 'salt_1',
      is_admin: true,
      image_key: 'user1-img',
      image_url: 'https://example.com/images/user1.jpg',
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password_hash: 'hashed_password_2',
      password_salt: 'salt_2',
      is_admin: false,
    },
  ]);

  // Insert sample genres and extract IDs
  const genreIds = await knex('genres')
    .insert([
      { name: 'Action' },   // id: 1
      { name: 'Adventure' }, // id: 2
      { name: 'Strategy' },  // id: 3
    ])
    .returning('id');
  const genreIdList = genreIds.map(g => g.id); // Extracting just the ID values

  // Insert sample developers and extract IDs
  const developerIds = await knex('developers')
    .insert([
      { name: 'Game Studio A', location: 'New York, USA', image_key: 'dev1-img', image_url: 'https://example.com/images/dev1.jpg' },
      { name: 'Indie Dev Team', location: 'San Francisco, USA' },
    ])
    .returning('id');
  const developerIdList = developerIds.map(d => d.id); // Extracting just the ID values

  // Insert sample games
  await knex('games').insert([
    {
      title: 'Epic Adventure',
      release_date: '2023-01-15',
      image_key: 'game1-img',
      image_url: 'https://example.com/images/game1.jpg',
      description: 'An exciting adventure game with stunning visuals.',
      genre_id: genreIdList[1], // Adventure
      developer_id: developerIdList[0], // Game Studio A
      platform: 'PC',
      price: 59.99,
      stock: 100,
    },
    {
      title: 'Tactical Warfare',
      release_date: '2022-11-05',
      image_key: 'game2-img',
      image_url: 'https://example.com/images/game2.jpg',
      description: 'A strategy game that tests your tactical skills.',
      genre_id: genreIdList[2], // Strategy
      developer_id: developerIdList[1], // Indie Dev Team
      platform: 'PC',
      price: 49.99,
      stock: 50,
    },
  ]);

  // Insert sample old purchase history
  await knex('old_purchase_history').insert([
    { user_id: 1, game_id: 1, purchase_date: '2023-03-10', quantity: 1 },
    { user_id: 2, game_id: 2, purchase_date: '2023-04-22', quantity: 2 },
  ]);

  // Insert sample purchase history
  await knex('purchase_history').insert([
    { user_id: 1, game_id: 1, purchase_date: '2024-01-05', quantity: 1, price: 59.99 },
    { user_id: 2, game_id: 2, purchase_date: '2024-02-17', quantity: 2, price: 99.98 },
  ]);
};

