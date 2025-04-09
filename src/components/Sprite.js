import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { GAME_CONSTANTS } from '../constants';

const SPRITE_SIZE = 16; // Original NES sprite size

const Sprite = ({ spriteSheet, frameY = 0, frameX = 0, scale = 1, flip = false }) => {
    const [currentFrameX, setCurrentFrameX] = useState(frameX);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // If frameX is provided as a number, use it directly (static frame)
        // If frameX is 'animate', cycle through frames
        if (frameX === 'animate') {
            setIsAnimating(true);
            const interval = setInterval(() => {
                setCurrentFrameX((prev) => (prev + 1) % 4); // Loop through 4 frames
            }, 100);
            return () => clearInterval(interval);
        } else {
            setIsAnimating(false);
            setCurrentFrameX(frameX);
        }
    }, [frameX]);

    return (
        <View 
            style={{ 
                width: SPRITE_SIZE * scale, 
                height: SPRITE_SIZE * scale, 
                overflow: 'hidden',
                transform: [{ scaleX: flip ? -1 : 1 }]
            }}
        >
            <Image
                source={spriteSheet}
                style={{
                    width: SPRITE_SIZE * 10,
                    height: SPRITE_SIZE * 10,
                    transform: [
                        { translateX: -currentFrameX * SPRITE_SIZE },
                        { translateY: -frameY * SPRITE_SIZE },
                    ],
                }}
                resizeMode="stretch"
            />
        </View>
    );
};

export default Sprite; 