const fs = require("fs");
const path = require("path");

const Product = require("./model");
const config = require("../config");

async function store(req, res, next) {
  try {
    let payload = req.body;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/upload/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        let product = new Product({ ...payload, image_url: filename });
        await product.save();
        return res.json(product);
      });

      src.on("error", async () => {
        next(error);
      });
    } else {
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}

module.exports = { store };
