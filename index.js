const cors = require("cors");
const express = require("express");
const ytdl = require("ytdl-core");
const { formatBytes, itagToQuality } = require("./utils");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/download", async (req, res) => {
  try {
    const url = req.query.url;
    const metaInfo = await ytdl.getBasicInfo(url);
    const { videoId, title } = metaInfo.videoDetails;

    const f = metaInfo.formats
      .filter((item) => typeof item.contentLength !== "undefined")
      .map((item) => ({
        ...item,
        fileSize: formatBytes(item.contentLength),
        mimeType: item.mimeType.split(";")[0],
        qualityLabel:
          item.qualityLabel || itagToQuality[item.itag] || "unknown",
      }));

    const audio = f.filter(({ mimeType }) => mimeType.startsWith("audio"));
    const video = f.filter(({ mimeType }) => mimeType.startsWith("video"));

    return res.status(200).json({ audio, video, videoId, title });
  } catch (err) {
    res.status(500).json({ error: "Error downloading video." });
  }
});

app.get("/api/file-download", async (req, res) => {
  const videoURL = req.query.url;
  const itag = req.query.itag;
  const mimeType = req.query.mimeType;
  const title = req.query.title;

  try {
    if (!videoURL || !itag) {
      return res.status(400).json({ error: "itag, and format are required." });
    }

    const sanitizedTitle = title.replace(/[^\w\d\s.-]/g, "");
    const filename = `${sanitizedTitle}.${mimeType.split("/")[1]}`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.header("Content-Type", `${mimeType}`);

    const options = { filter: (format) => format.itag === parseInt(itag) };
    return ytdl(videoURL, options).pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Error file downloading." });
  }
});

const PORT = process.env.APP_PORT;
app.listen(PORT, () => console.log(`app running at ${PORT}`));

