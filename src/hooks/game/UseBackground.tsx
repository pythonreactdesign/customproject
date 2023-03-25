import { useEffect, useRef } from 'react';

import { BACKGROUNDS, ANIMATION, BACKGROUND } from './gameVariables';

interface Background {
  image: HTMLImageElement | null;
  x: number;
  y: number;
  width: number;
  height: number;
  scrollX: number;
  scale: number;
}

interface Backgrounds {
  name: string;
  image: HTMLImageElement | null;
  src: string;
  width: number;
  height: number;
}

export const useBackgrounds = (
  ctx: CanvasRenderingContext2D | null,
  isAnimateCanvas: React.RefObject<boolean>,
  canvasWidth: React.RefObject<number>,
  canvasHeight: React.RefObject<number>,
  gameLevels: React.RefObject<number>,
  isGameLevelChanged: React.RefObject<boolean>,
) => {
  const backgrounds = useRef<Backgrounds[]>(BACKGROUNDS);
  const background = useRef<Background>(BACKGROUND);
  const isLoaded = useRef(false);
  const isSet = useRef(false);
  const countLoaded = useRef(0);

  const setBackground = () => {
    if ((!isSet.current && countLoaded.current === -1) || isGameLevelChanged.current) {
      const imageWidth = backgrounds.current[gameLevels.current!].width;
      const imageHeight = backgrounds.current[gameLevels.current!].height;
      const scaleX = canvasWidth.current! / imageWidth;
      const scaleY = canvasHeight.current! / imageHeight;
      background.current!.image = backgrounds.current[gameLevels.current!].image;
      background.current!.x = 0;
      background.current!.y = 0;
      const scale = scaleX > 1 || scaleY > 1 ? Math.max(scaleX, scaleY) : Math.max(scaleX, scaleY);
      background.current!.width = imageWidth * scale;
      background.current!.height = imageHeight * scale;
      background.current!.scrollX = ANIMATION.backgroundScrollSpeed[gameLevels.current!];
      isSet.current = true;
    }
  };

  useEffect(() => {
    if (!isLoaded.current) {
      backgrounds.current.forEach((backg) => {
        const newImage = new Image();
        newImage.src = backg.src;
        newImage.onload = () => {
          backg.image = newImage;
          backg.width = newImage.width;
          backg.height = newImage.height;
          countLoaded.current += 1;
          if (countLoaded.current === backgrounds.current.length) {
            countLoaded.current = -1;
            isLoaded.current = true;
            setBackground();
          }
        };
      });
    }
    return () => {
      isLoaded.current = true;
    };
  }, []);

  const drawBackground = () => {
    if (isSet.current && isAnimateCanvas.current)
      ctx!.drawImage(
        background.current!.image as CanvasImageSource,
        background.current!.x,
        background.current!.y,
        background.current!.width * background.current!.scale,
        background.current!.height * background.current!.scale,
      );
    ctx!.drawImage(
      background.current!.image as CanvasImageSource,
      background.current!.x + background.current!.width * background.current!.scale - 1,
      background.current!.y,
      background.current!.width * background.current!.scale,
      background.current!.height * background.current!.scale,
    );
  };

  const updateBackground = () => {
    if (background.current!.x <= -background.current!.width) {
      background.current!.x = 0;
    }
    background.current!.x += background.current!.scrollX;

    drawBackground();
  };

  return { setBackground, updateBackground, drawBackground };
};
