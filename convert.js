const sharp = require('sharp');
const fs = require('fs');

const convertSvgToPng = async (svgPath, pngPath) => {
    try {
        const svgBuffer = fs.readFileSync(svgPath);
        await sharp(svgBuffer)
            .png()
            .toFile(pngPath);
        console.log(`Converted ${svgPath} to ${pngPath}`);
    } catch (error) {
        console.error(`Error converting ${svgPath}:`, error);
    }
};

// Convert all SVG files
convertSvgToPng('assets/rink.svg', 'assets/rink.png');
convertSvgToPng('assets/player.svg', 'assets/player.png');
convertSvgToPng('assets/enemy.svg', 'assets/enemy.png');
convertSvgToPng('assets/puck.svg', 'assets/puck.png'); 