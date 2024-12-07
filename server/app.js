const express = require("express");
const fs = require("fs");
const app = express();

app.get("/ads", function (request, response) {
  let range = request.headers.range;
  if (!range) {
    range = "bytes=0-";
  }

  const videoPath = "../videos/ads.mp4";
  const videoSize = fs.statSync(videoPath).size;
  const chunkSize = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunkSize, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "content-type": "video/mp4",
  };

  response.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(response);
});

app.listen(8000);
