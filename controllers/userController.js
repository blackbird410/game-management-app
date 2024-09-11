
const { body, validationResult } = require('express-validator');
const { generateToken } = require('../lib/jwtUtils');
const asyncHandler = require('express-async-handler');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const { 
  genPassword,
  validPassword,
} = require('../lib/passwordUtils');

const { 
  getAllUsers,
  getUserByEmail,
  getUserById,
  addUser,
  updateUserById,
} = require('../models/user');

const { getUserPurchaseHistory } = require('../models/purchase_history');
const { getAllGames } = require('../models/game');
const { getAllDevelopers } = require('../models/developer');

const { 
  addImageToBucket, 
  getImageSignedUrl, 
  deleteImage 
} = require('../lib/awsUtils');

// Render the index page with users data
const renderIndex = asyncHandler(async (req, res, next) => {
  const users = await getAllUsers();

  res.render('users', { users, user: req.user });
});

const renderProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('user_profile', { 
      user,
      errors: null
    });
  } catch (error) {
    console.error('Error fetching user for profile page:', error);
    res.status(500).send('Internal Server Error');
  }
};

const renderPurchaseHistory = async(req, res, next) => {
  try {
    const user = req.user;
    const purchaseHistory = await getUserPurchaseHistory(user.id);
    let updatedPurchases = [];
    const games = await getAllGames();

    for (const game of games) game.image_url = getImageSignedUrl(game.image_key);

    for (const purchase of purchaseHistory) {
      const game = games.find(g => g.id === purchase.game_id);
      updatedPurchases.push({ ...purchase, game });
    }

    res.render('purchase_history', { purchases: updatedPurchases, user });
  } catch (error) {
    console.error('Error fetching user purchase history:', error);
    res.status(500).send('Internal Server Error');
  }
};

const renderAdminDashboard = asyncHandler(async (req, res, next) => {
  const developers = await getAllDevelopers();
  const users = await getAllUsers();
  const games = await getAllGames();

  res.render('admin_dashboard', {
    developersCount: developers.length, 
    usersCount: users.length,
    gamesCount: games.length,
    user: req.user
  });
});

const registerGet = asyncHandler(async (req, res, next) => {
  if (req.user) return res.redirect('/');

  res.render('register', { errors: null, user: null });
});

const registerPost = [
  upload.single('profile_picture'),
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Email is required'),
  body('password').isString().trim().notEmpty().withMessage('Password is required'),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('register', { 
        errors: errors.array(),
        name: req.body.name,
        email: req.body.email,
        user: null
      });
    }

    const isEmailAlreadyUsed = await getUserByEmail(req.body.email);
    if (isEmailAlreadyUsed) {
      return res.status(400).render('add_admin', { 
        errors: [{ msg: 'Email is already in use' }],
        name: req.body.name,
        email: req.body.email,
        user: null
      });
    }

    const { salt, hash } = genPassword(req.body.password);
    
    const user = {
      name: req.body.name,
      email: req.body.email,
      password_hash: hash,
      password_salt: salt,
    };

    if (req.file) {
      try {
        user.image_key = await addImageToBucket(req.file.buffer, req.file.mimetype, req.file.originalname);
        user.image_url = getImageSignedUrl(user.image_key);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).send('Internal Server Error');
      }
    }

    try {
      console.log(user);
      await addUser(user);
      res.redirect('/');
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).send('Internal Server Error');
    }
  }),
];

const loginGet = asyncHandler(async (req, res, next) => {
  if (req.user) return res.redirect('/');

  res.render('login', { errors: null, user: null });
});

const loginPost = [
  body('email').isEmail().normalizeEmail().withMessage('Email is required'),
  body('password').isString().trim().notEmpty().withMessage('Password is required'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render('login', { 
        errors: errors.array(),
        email: req.body.email,
      });
    }

    try {
      const user = await getUserByEmail(req.body.email);
      if (!user || !validPassword(req.body.password, user.password_salt, user.password_hash)) {
        return res.status(401).render('login', { 
          errors: [{ msg: 'Invalid email or password' }],
          email: req.body.email,
          user: null
        });
      }

      const token = generateToken(user);
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
      res.redirect('/');
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).send('Internal Server Error');
    }
  }),
];

const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie('token');
  res.redirect('/');
});


const addAdminGet = asyncHandler(async (req, res, next) => {
  res.render('add_admin', { errors: null, user: null });
});

const addAdminPost = [
  upload.single('profile_picture'),
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Email is required'),
  body('password').isString().trim().notEmpty().withMessage('Password is required'),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('add_admin', { 
        errors: errors.array(),
        name: req.body.name,
        email: req.body.email,
      });
    }

    const isEmailAlreadyUsed = await getUserByEmail(req.body.email);
    if (isEmailAlreadyUsed) {
      return res.status(400).render('add_admin', { 
        errors: [{ msg: 'Email is already in use' }],
        name: req.body.name,
        email: req.body.email,
        user: req.user
      });
    }

    const { salt, hash } = genPassword(req.body.password);

    const user = {
      name: req.body.name,
      email: req.body.email,
      password_hash: hash,
      password_salt: salt,
      is_admin: true
    };

    if (req.file) {
      try {
        user.image_key = await addImageToBucket(req.file.buffer, req.file.mimetype, req.file.originalname);
        user.image_url = getImageSignedUrl(user.image_key);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).send('Internal Server Error');
      }
    }

    try {
      await addUser(user);
      res.redirect('/');
    } catch (error) {
      console.error('Error adding admin:', error);
      res.status(500).send('Internal Server Error');
    }
  }),
];

const updateUserGet = asyncHandler(async (req, res, next) => {
  const user = await getUserById(req.user.id);
  res.render('user_profile', { 
    errors: null,
    user,
  });
});

const updateUserPost = [
  upload.single('profile_picture'),
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Email is required'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('user_profile', { 
        errors: errors.array(),
        name: req.body.name,
        email: req.body.email,
      });
    }

    // Updates only the user email, name and profile picture
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.name = req.body.name;
    user.email = req.body.email;

    if (req.file) {
      try {
        if (user.image_key) {
          await deleteImage(user.image_key);
        }
        user.image_key = await addImageToBucket(req.file.buffer, req.file.mimetype, req.file.originalname);
        user.image_url = getImageSignedUrl(user.image_key);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).send('Internal Server Error');
      }
    }

    try {
      await updateUserById(user.id, user);
      res.redirect('/profile');
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Internal Server Error');
    }
  }),
];

const updatePassword = [
  body('old_password').isString().trim().notEmpty().withMessage('Old password is required'),
  body('new_password').isString().trim().notEmpty().withMessage('New password is required'),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.new_password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('user_profile', { 
        errors: errors.array(),
        name: req.body.name,
        email: req.body.email,
        user: null
      });
    }

    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const { old_password, new_password } = req.body;

    const isValidPassword = validPassword(old_password, user.password_salt, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).render('user_profile', { 
        errors: [{ msg: 'Invalid old password' }],
        name: req.body.name,
        email: req.body.email,
        user: null
      });
    }

    // Generate new password hash and salt
    const { salt, hash } = genPassword(new_password); // Use new_password
    user.password_hash = hash;
    user.password_salt = salt;

    try {
      await updateUserById(user.id, user);
      res.redirect('/profile');
    } catch (error) {
      console.error('Error updating user password:', error);
      res.status(500).send('Internal Server Error');
    }
  }),
];

module.exports = { 
  renderIndex, 
  registerGet,
  registerPost,
  loginGet,
  loginPost,
  logout,
  addAdminGet,
  addAdminPost,
  renderProfile,
  renderPurchaseHistory,
  renderAdminDashboard,
  updateUserGet,
  updateUserPost,
  updatePassword,
};
