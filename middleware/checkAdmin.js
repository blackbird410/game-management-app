const { verifyToken } = require('../lib/jwtUtils');

const checkAdmin = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.render('unauthorized');
  }
  next();
};

const isAdmin = (req) => {
    let isAdmin = false;

    if (req.cookies) {
      const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
      if (token ) {
        const user = verifyToken(token);
        isAdmin = user.is_admin;
      }
    }

  return isAdmin;
}

module.exports = {
  checkAdmin,
  isAdmin
};
