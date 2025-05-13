const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDirectory = path.join(__dirname, 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconDirectory)) {
    fs.mkdirSync(iconDirectory);
}

// Generate icons for each size
sizes.forEach(size => {
    sharp('app-icon.png')  // You'll need to create this base icon
        .resize(size, size)
        .toFile(path.join(iconDirectory, `icon-${size}x${size}.png`))
        .then(info => console.log(`Generated ${size}x${size} icon`))
        .catch(err => console.error(`Error generating ${size}x${size} icon:`, err));
}); 