const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/properties');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        '-' +
        uniqueSuffix +
        '.' +
        file.originalname.split('.').pop()
    ); // Set the file name
  },
});

exports.propertyImageUpload = multer({ storage });
