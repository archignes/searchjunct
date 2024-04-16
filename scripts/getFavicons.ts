const fs = require('fs');
const path = require('path');
const https = require('https');
const systems = require('../src/data/systems.json');

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

const getDomainFromUrl = (url) => {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch (error) {
    console.error(`Error extracting domain from URL: ${url}`, error);
    return null;
  }
};

const downloadFavicons = async () => {
  for (const system of systems) {
    const domain = getDomainFromUrl(system.searchLink);
    if (domain) {
      const faviconPath = path.join(__dirname, '../public/favicons', `${system.id}.ico`);
      if (!fs.existsSync(faviconPath)) {
        const faviconUrl = `https://external-content.duckduckgo.com/ip3/${domain}.ico`;
        try {
          await downloadFile(faviconUrl, faviconPath);
          console.log(`Downloaded favicon for ${system.name}`);
        } catch (error) {
          console.error(`Failed to download favicon for ${system.name}:`, error);
        }
      } else {
        console.log(`Favicon already exists for ${system.name}`);
      }
    }
  }
};

downloadFavicons();
