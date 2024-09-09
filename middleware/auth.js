const { verifyToken } = require('../lib/jwtUtils');

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token || req.headers['autorization']?.split(' ')[1];
  if (!token) {
    return res.redirect('/login');
  }

  try {
    const user = verifyToken(token); 
    req.user = user;
    next();
  } catch (error) { 
    return res.redirect('/login');
  }
};

module.exports = authenticateJWT;
