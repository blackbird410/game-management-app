
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const { 
  getAllDevelopers,
  addDeveloper,
  getDeveloperById,
  updateDeveloperById,
  deleteDeveloperById,
} = require('../models/developer');

const { 
  addImageToBucket, 
  getImageSignedUrl, 
  deleteImage 
} = require('../lib/awsUtils');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Render the index page with developers data
const renderIndex = asyncHandler(async (req, res, next) => {
  const developers = await getAllDevelopers();

  for (const developer of developers) {
    developer.image_url = getImageSignedUrl(developer.image_key);
  }

  res.render('developers', {
    title: "Developer Collection",
    developers: developers,
    user: req.user
  });
});

// Render the page for adding a new developer
const addDeveloperGet = async (req, res) => {
  res.render('form_developer', { 
    title: 'Add New Developer', 
    developer: null,
    errors: null,
    user: req.user
  })
};

const addDeveloperPost = [
  upload.single('profile_picture'),
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('location').isString().trim().notEmpty().withMessage('Location is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('form_developer', { 
        errors: errors.array(),
        developer: req.body,
        user: req.user
      });
    }

    const developer = {
      name: req.body.name,
      location: req.body.location,
    };

    if (req.file) {
      try {
        developer.image_key = await addImageToBucket(req.file.buffer, req.file.mimetype, req.file.originalname);
        developer.image_url = getImageSignedUrl(developer.image_key);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).send('Internal Server Error');
      }
    }

    try {
      await addDeveloper(developer);
      res.redirect('/developers');
    } catch (error) {
      console.error('Error adding developer:', error);
      res.status(500).send('Internal Server Error');
    }
  }
];

// Render the page for editing a developer
const editDeveloperGet = async (req, res) => {
  try {
    const developer = await getDeveloperById(req.params.id);
    developer.image_url = getImageSignedUrl(developer.image_key);

    res.render('form_developer', { 
      title: 'Edit Developer',
      developer: developer,
      errors: null,
      user: req.user
    });
  } catch (error) {
    console.error('Error fetching developer for edit:', error);
    res.status(500).send('Internal Server Error');
  }
};

const editDeveloperPost = [
  upload.single('profile_picture'),
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('location').isString().trim().notEmpty().withMessage('Location is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('form_developer', { 
        errors: errors.array(),
        developer: req.body,
        user: req.user
      });
    }

    try {
      const developer = await getDeveloperById(req.params.id);
      if (!developer) {
        return res.status(404).send('Developer not found');
      }

      developer.name = req.body.name;
      developer.location = req.body.location;

      if (req.file) {
        try {
          developer.image_key = await addImageToBucket(req.file.buffer, req.file.mimetype, req.file.originalname);
          developer.image_url = getImageSignedUrl(developer.image_key);
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          return res.status(500).send('Internal Server Error');
        }
      }

      await updateDeveloperById(req.params.id, developer);
      res.redirect('/developers');
    } catch (error) {
      console.error('Error updating developer:', error);
      res.status(500).send('Internal Server Error');
    }
  }
];

// Render the page for deleting a developer
const deleteDeveloperGet = async (req, res) => {
  try {
    const developer = await getDeveloperById(req.params.id);
    developer.image_url = getImageSignedUrl(developer.image_key);

    res.render('delete_developer', { 
      title: 'Delete Developer',
      developer: developer,
      user: req.user
    });
  } catch (error) {
    console.error('Error fetching developer for delete:', error);
    res.status(500).send('Internal Server Error');
  }
};

const deleteDeveloperPost = async (req, res) => {
  try {
    const developer = await getDeveloperById(req.params.id);
    if (!developer) {
      return res.status(404).send('Developer not found');
    }

    if (developer.image_key) {
      await deleteImage(developer.image_key);
    }

    await deleteDeveloperById(req.params.id);
    res.redirect('/developers');
  } catch (error) {
    console.error('Error deleting developer:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { 
  renderIndex, 
  addDeveloperGet,
  addDeveloperPost,
  editDeveloperGet,
  editDeveloperPost,
  deleteDeveloperGet,
  deleteDeveloperPost
};
