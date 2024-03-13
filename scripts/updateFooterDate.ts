const fs = require('fs');
const path = require('path');

const footerPath = path.join(__dirname, '../src/components/Footer.tsx');
const fileContents = fs.readFileSync(footerPath, 'utf8');

const updatedContents = fileContents.replace(
    /const lastUpdated = ".*?";/,
    `const lastUpdated = "${new Date().toISOString()}";`
);

fs.writeFileSync(footerPath, updatedContents);