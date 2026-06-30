const multer = require('multer');
const path = require('path');
const fs = require('fs');

// multer instance that saves into uploads/subfolder with common image types capped at 5mb.
function makeUploader(subfolder) {
  const destDir = path.join(__dirname, '..', 'uploads', subfolder);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, destDir),
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`; 
      // in case 2 files uploaded at the same millisecond we add a random number to avoid overwriting
      cb(null, safeName);
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extensionOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const isValidFileType = allowed.test(file.mimetype); 
    if (extensionOk && isValidFileType) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpg, png, webp) are allowed'));
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  });
}

module.exports = makeUploader;
