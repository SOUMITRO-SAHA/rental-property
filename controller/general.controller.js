const formidable = require('formidable');
const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Banner Controllers
exports.getBanner = async (req, res) => {
  try {
    const banner = await db.banner.findMany();

    res.status(200).json({
      success: true,
      message: 'Successfully fetched the banner',
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the banner',
      error: error.message,
    });
  }
};

exports.addBanner = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Error occurred while parsing form data',
          error: err.message,
        });
        return;
      }
      let imagePath = '';
      if (files) {
        const uploadFolderPath = path.join(__dirname, '../uploads/banner');
        const photo = files.image;
        const filePath = photo[0].filepath;
        const data = fs.readFileSync(filePath);
        const imageExtension = photo[0].mimetype.split('/')[1];
        const imageName = `${Date.now()}.${imageExtension}`;
        imagePath = path.join(uploadFolderPath, imageName);
        fs.writeFileSync(imagePath, data);
      }

      const newBanner = await db.banner.create({
        data: { imageUrl: imagePath },
      });

      res.status(200).json({
        success: true,
        message: 'Banner created successfully',
        data: newBanner,
      });
    } catch (error) {
      res.status(500).json({
        success: true,
        message: 'An error occurred while creating the banner',
        error: error.message,
      });
    }
  });
};

exports.updateBanner = async (req, res) => {
  const { id } = req.params;
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Error occurred while parsing form data',
          error: err.message,
        });
      }

      let imagePath;
      if (files) {
        const uploadFolderPath = path.join(__dirname, '../uploads/banner');
        const photo = files.image;
        const filePath = photo[0].filepath;
        const data = fs.readFileSync(filePath);
        const imageExtension = photo[0].mimetype.split('/')[1];
        const imageName = `${Date.now()}.${imageExtension}`;
        imagePath = path.join(uploadFolderPath, imageName);
        fs.writeFileSync(imagePath, data);
      }

      const updatedBanner = await db.banner.update({
        where: { id: parseInt(id) },
        data: {
          imageUrl: imagePath,
        },
      });

      if (!updatedBanner) {
        return res.status(404).json({
          success: false,
          message: 'No banners found for update',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Banner updated successfully',
        data: updatedBanner,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'An error occurred while updating the banner',
        error: error.message,
      });
    }
  });
};
