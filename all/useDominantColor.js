// src/hooks/useDominantColor.js
import { useState, useEffect } from 'react';

export function useDominantColor(imageUrl) {
    const [color, setColor] = useState('#1a1a2e');
    const [palette, setPalette] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!imageUrl) {
            setLoading(false);
            return;
        }

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 50;
                canvas.height = 28;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 50, 28);

                const imageData = ctx.getImageData(0, 0, 50, 28);
                const data = imageData.data;

                // ✅ Get average color
                let r = 0, g = 0, b = 0, count = 0;
                for (let i = 0; i < data.length; i += 4) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }

                const avgR = Math.floor(r / count);
                const avgG = Math.floor(g / count);
                const avgB = Math.floor(b / count);

                // ✅ Create a gradient palette
                const mainColor = `rgb(${avgR}, ${avgG}, ${avgB})`;
                const lightColor = `rgb(${Math.min(avgR + 40, 255)}, ${Math.min(avgG + 40, 255)}, ${Math.min(avgB + 40, 255)})`;
                const darkColor = `rgb(${Math.max(avgR - 60, 0)}, ${Math.max(avgG - 60, 0)}, ${Math.max(avgB - 60, 0)})`;

                setColor(mainColor);
                setPalette({ main: mainColor, light: lightColor, dark: darkColor });
                setLoading(false);
            } catch (err) {
                console.error('Error extracting color:', err);
                setColor('#1a1a2e');
                setLoading(false);
            }
        };

        img.onerror = () => {
            setColor('#1a1a2e');
            setLoading(false);
        };
    }, [imageUrl]);

    return { color, palette, loading };
}