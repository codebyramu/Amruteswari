const https = require('https');
const fs = require('fs');

const url = "https://upload.wikimedia.org/wikipedia/commons/4/4e/Wheat_field_in_the_wind_%28video%29.webm";
const dest = "./frontend/public/videos/hero_bg.webm";

const file = fs.createWriteStream(dest);

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (response) => {
  if (response.statusCode === 301 || response.statusCode === 302) {
    https.get(response.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
      res2.pipe(file);
      file.on('finish', () => file.close());
    });
  } else {
    response.pipe(file);
    file.on('finish', () => file.close());
  }
}).on('error', (err) => {
  fs.unlink(dest);
  console.error("Error: ", err.message);
});
