const { check, validationResult } = require("express-validator");

module.exports = {
  validateCart: [
    check("items.*._id").notEmpty(),
    check("items.*.qty").notEmpty(),
    check("items.*.idVariantOption").notEmpty(),
    check("items.*.variantName").notEmpty(),
    check("items.*.variantOption").notEmpty(),
    check("items.*.variantStock").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).send({ error: error.array() });
      }
      next();
    },
  ],
  validateOrder: [
    check("nama_lengkap").notEmpty(),
    check("email").isEmail(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).send({ error: error.array() });
      }
      next();
    },
  ],
  validateAuth: [
    check("full_name").notEmpty(),
    check("email").isEmail(),
    check("password").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).send({ error: error.array() });
      }
      next();
    },
  ],
  validateCategory: [
    check("name").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).send({ error: error.array() });
      }
      next();
    },
  ],
  validateVariant: [
    check("name").notEmpty(),
    check("option.*.name").notEmpty(),
    check("option.*.stock").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).send({ error: error.array() });
      }
      next();
    },
  ],
  validateDiscount: [
    check("name").notEmpty(),
    check("type").notEmpty(),
    check("status").notEmpty(),
    check("value").notEmpty(),
    check("date").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).send({ error: error.array() });
      }
      next();
    },
  ],
  validateProductToDiscount: [
    check("product").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).send({ error: error.array() });
      }
      next();
    },
  ],
};
