const { resizeImage } = require("./utils");
const path = require("path");

module.exports = {
  imageFileUpload: async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName);

    try {
      const resizedImages = await Promise.all([
        resizeImage(fileBuffer, 200, 200, `small${fileExtension}`),
        resizeImage(fileBuffer, 400, 400, `medium${fileExtension}`),
        resizeImage(fileBuffer, 800, 800, `large${fileExtension}`),
      ]);

      res.json({
        message: "Files uploaded and resized successfully.",
        files: resizedImages,
      });
    } catch (error) {
      console.error("Error processing images:", error);
      res.status(500).send("Error processing images.");
    }
  },
};
