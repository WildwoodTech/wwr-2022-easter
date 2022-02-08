const authentication = async (req, res, next) => {
  if (
    req.body.pass === process.env.ADMIN_PASS &&
    req.body.pin === process.env.ADMIN_PIN
  ) {
    return next();
  }
  res.status(404).json({ success: false, message: 'Requires authentication' });
};

module.exports = authentication;
