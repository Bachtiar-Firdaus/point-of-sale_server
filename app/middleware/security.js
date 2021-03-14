module.exports = {
  securityCek: [
    (req, res, next) => {
      if (!req.user) {
        return res.json({
          error: 1,
          message: `Anda Belum Login Atau Token Expired`,
        });
      }
      next();
    },
  ],
};
