module.exports = {
  securityCek: [
    (req, res, next) => {
      if (!req.user) {
        return res.json({
          error: 1,
          message: `Your're not login or token expired`,
        });
      }
      next();
    },
  ],
};
