// be/middleware/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // store in 'uploads/' directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // get extension (.jpg, .png)
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
