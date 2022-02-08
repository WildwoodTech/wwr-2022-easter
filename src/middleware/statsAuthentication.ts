const statsAuthentication = async (req, res, next) => {
  if (req.body.pass === process.env.STATS_PASS) {
    return next();
  }
  res.status(404).json({ success: false });
};

module.exports = statsAuthentication;
