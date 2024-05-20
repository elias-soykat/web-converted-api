const cors = require("cors");
const express = require("express");
const multer = require("multer");
const { downloadVideo, selectedFileDownload } = require("./src/youtube-video");
const { imageFileUpload } = require("./src/image-resize");
require("dotenv").config();

const app = express();

const origin = ["https://webconverted.com", "http://localhost:3000"];
app.use(cors({ origin }));
app.use(express.json());

app.get("/api", (req, res) => res.json("Okay!"));

// YOUTUBE_VIDEO_ROUTES
app.get("/api/download", downloadVideo);
app.get("/api/file-download", selectedFileDownload);

// IMAGE_RESIZE_ROUTES

const storage = multer.memoryStorage();
const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), imageFileUpload);

const PORT = process.env.APP_PORT;
app.listen(PORT, () => console.log(`app running at ${PORT}`));
