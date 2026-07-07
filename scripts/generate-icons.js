import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the icons directory exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes to generate
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../public/favicon.svg');

// Generate each icon size
async function generateIcons() {
  try {
    for (const size of iconSizes) {
      const outputFile = path.join(iconsDir, `icon-${size}x${size}.png`);
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      console.log(`Generated ${outputFile}`);
    }
    
    // Also create a favicon.ico
    await sharp(inputSvg)
      .resize(64, 64)
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    console.log('Generated favicon.ico');
    
    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
