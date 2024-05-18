function formatBytes(bytes) {
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const itagToQuality = {
  140: "360p",
  249: "360p",
  250: "480p",
  251: "720p",
  18: "360p",
  22: "720p",
  37: "1080p",
  38: "3072p",
};

module.exports = {
  formatBytes,
  itagToQuality,
};
