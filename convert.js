const sharp = require('sharp');
const fs = require('fs');

async function convertSvgToPng(svgPath, pngPath) {
    try {
        const svgBuffer = fs.readFileSync(svgPath);
        await sharp(svgBuffer)
            .png()
            .toFile(pngPath);
        console.log(`Converted ${svgPath} to ${pngPath}`);
    } catch (error) {
        console.error(`Error converting ${svgPath}:`, error);
    }
}

// Convert all SVG files to PNG
convertSvgToPng('assets/player_sprites.svg', 'assets/player_sprites.png');
convertSvgToPng('assets/enemy_sprites.svg', 'assets/enemy_sprites.png');
convertSvgToPng('assets/goalie_sprites.svg', 'assets/goalie_sprites.png');
convertSvgToPng('assets/goal_net.svg', 'assets/goal_net.png');
convertSvgToPng('assets/puck.svg', 'assets/puck.png');
convertSvgToPng('assets/rink.svg', 'assets/rink.png'); 