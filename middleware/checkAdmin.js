const checkAdmin = (req, res, next) => {
  console.log(req.user);
  if (!req.user?.is_admin) {
    return res.render('unauthorized');
  }
  next();
};

module.exports = checkAdmin;
