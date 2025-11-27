
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const lightImagePath = 'public/assets/why-i-keep-starting-blogs-and-why-this-time-it-might-actually-stick/hero-light.png';
const darkImagePath = 'public/assets/why-i-keep-starting-blogs-and-why-this-time-it-might-actually-stick/hero-dark.png';

async function processImage() {
    try {
        console.log('Processing image...');

        // 1. Read the light image
        // 2. Invert it (white bg becomes black, dark lines become light)
        // 3. We want specific background #18181B. 
        //    Inverted white is black (#000000). 
        //    Inverted dark grey lines (#333333) become light grey (#CCCCCC).
        //    We want lines to be white (#FFFFFF) and background #18181B.

        // Better approach:
        // 1. Extract the lines. Since it's a line drawing, we can threshold or use grayscale values as alpha.
        // 2. Create a new image with background #18181B.
        // 3. Composite white lines onto it.

        const input = sharp(lightImagePath);
        const metadata = await input.metadata();

        // Create a mask from the input image
        // Dark lines should be opaque in the mask, white background should be transparent.
        // In the input: lines are dark, bg is white.
        // We want a mask where lines are white (255) and bg is black (0) to use as alpha for white color?
        // Or just simply: 
        // 1. Negate the image -> lines become light, bg becomes dark.
        // 2. Linear adjustment to push the background to pure black and lines to pure white.
        // 3. Use this as an alpha mask for a solid white overlay on top of #18181B.

        // Let's try a simple negate first to see what we get, but we need to force the background color.

        // Strategy:
        // 1. Load image, convert to grayscale.
        // 2. Negate (invert). Now lines are light, bg is dark.
        // 3. Threshold or level adjustment to make bg pure black (0) and lines pure white (255).
        //    This creates our "alpha mask" of where the lines are.
        // 4. Create a new image of same size with color #18181B.
        // 5. Create a solid white image of same size.
        // 6. Apply the mask to the solid white image.
        // 7. Composite the masked white image onto the #18181B background.

        const { width, height } = metadata;

        // Create the mask: Invert and stretch contrast
        const mask = await input
            .clone()
            .grayscale()
            .negate()
            // Increase contrast to separate lines from background noise if any
            // .linear(a, b) -> a * input + b. 
            // We want to boost the whites.
            .linear(1.5, -20)
            .toBuffer();

        // Create solid white lines layer with the mask
        const whiteLines = await sharp({
            create: {
                width: width,
                height: height,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        })
            .joinChannel(mask) // This appends the mask as alpha channel? No, joinChannel adds channels.
        // To use an image as alpha, we should use composite with 'dest-in' or similar?
        // Actually sharp has `bandbool` or we can just ensure the mask is the alpha channel.

        // Simpler way with sharp:
        // Use the inverted grayscale image as the alpha channel of a white image.
        // 1. Create a white image.
        // 2. Add the inverted original as its alpha channel.

        const inverted = await input.clone().grayscale().negate().toBuffer();

        const whiteOverlay = await sharp({
            create: {
                width: width,
                height: height,
                channels: 3,
                background: '#FFFFFF'
            }
        })
            .joinChannel(inverted) // Add inverted image as alpha
            .png()
            .toBuffer();

        // Now composite this white overlay onto the dark background
        await sharp({
            create: {
                width: width,
                height: height,
                channels: 4,
                background: '#18181B'
            }
        })
            .composite([{ input: whiteOverlay }])
            .png()
            .toFile(darkImagePath);

        console.log('Successfully created dark mode hero image at:', darkImagePath);

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

processImage();
