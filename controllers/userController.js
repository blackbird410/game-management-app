
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const { 
  genPassword,
  validPassword,
} = require('../lib/passwordUtils');

const { 
  getAllUsers,
  getUserById,
  getUserByEmail,
  addUser,
  updateUserById,
  deleteUserById,
} = require('../models/user');

// Render the index page with users data
const renderIndex = asyncHandler(async (req, res, next) => {
  const users = await getAllUsers();

  res.render('users', { users });
});

const registerGet = asyncHandler(async (req, res, next) => {
  res.render('register');
});

const registerPost = [
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
      });
    }

    const { salt, hash } = genPassword(req.body.password);

    const user = {
      name: req.body.name,
      email: req.body.email,
      password_hash: hash,
      password_salt: salt,
    };

    try {
      await addUser(user);
      res.redirect('/');
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).send('Internal Server Error');
    }
  }),
];

const loginGet = asyncHandler(async (req, res, next) => {
  res.render('login');
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
      if (!user) {
        return res.status(401).render('login', { 
          errors: [{ msg: 'Invalid email or password' }],
          email: req.body.email,
        });
      }

      if (!validPassword(req.body.password, user.password_salt, user.password_hash)) {
        return res.status(401).render('login', { 
          errors: [{ msg: 'Invalid email or password' }],
          email: req.body.email,
        });
      }

      req.session.user = user;
      res.redirect('/');
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).send('Internal Server Error');
    }
  }),
];


const logout = asyncHandler(async (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error destroying session:', error);
      return res.status(500).send('Internal Server Error');
    }

    res.redirect('/');
  });
});

const addAdminGet = asyncHandler(async (req, res, next) => {
  res.render('add_admin');
});

const addAdminPost = [
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

    const { salt, hash } = genPassword(req.body.password);

    const user = {
      name: req.body.name,
      email: req.body.email,
      password_hash: hash,
      password_salt: salt,
      is_admin: true
    };

    try {
      await addUser(user);
      res.redirect('/');
    } catch (error) {
      console.error('Error adding admin:', error);
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
};
