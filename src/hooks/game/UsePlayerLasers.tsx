import { useEffect, useRef } from 'react';

import { LASERSALL, MOBILE } from './gameVariables';

export interface ShootedPlayerLasers {
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  strength: number;
  speed: number;
  isDelete: boolean;
  image: HTMLImageElement | null;
}

export interface LasersAll {
  name: string;
  image: HTMLImageElement | null;
  src: string;
  width: number;
  height: number;
  strength: number;
  speed: number;
}

export const usePlayerLasers = (ctx: CanvasRenderingContext2D | null, canvasWidth: React.RefObject<number>) => {
  const lasersAll = useRef<LasersAll[]>(LASERSALL);
  const shootedPlayerLasers = useRef<ShootedPlayerLasers[]>([]);
  const isLoaded = useRef(false);
  const countLoaded = useRef(0);

  const setPlayerLasers = (
    playerX: number,
    playerY: number,
    playerWidth: number,
    playerHeight: number,
    laserName: string,
    numbersOfLaser: number,
  ) => {
    if (isLoaded.current && countLoaded.current === -1) {
      const laser = lasersAll.current.find((laser) => laser.name === laserName)!;
      const newLaser = {
        name: laserName,
        x: playerX + playerWidth,
        y: numbersOfLaser === 1 ? playerY + playerHeight / 2 : playerY,
        width: laser.width,
        height: laser.height,
        strength: laser.strength,
        speed: laser.speed,
        isDelete: false,
        image: laser.image,
      };
      shootedPlayerLasers.current.push(newLaser);
      if (numbersOfLaser === 2) {
        const newLaser2 = {
          name: laserName,
          x: playerX,
          y: playerY + playerHeight,
          width: laser.width,
          height: laser.height,
          strength: laser.strength,
          speed: laser.speed,
          isDelete: false,
          image: laser.image,
        };
        shootedPlayerLasers.current.push(newLaser2);
      }
    }
  };

  useEffect(() => {
    if (!isLoaded.current && typeof window !== 'undefined') {
      const isSmallDisplay = window.innerWidth * window.innerHeight < MOBILE.smallerPixels;
      lasersAll.current.forEach((laser) => {
        const newImage = new Image();
        newImage.src = isSmallDisplay ? laser.src.split('.png')[0] + 'Mobile.png' : laser.src;
        newImage.onerror = () => {
          newImage.onerror = null;
          newImage.src = laser.src;
        };
        newImage.onload = () => {
          laser.image = newImage;
          laser.width = newImage.width;
          laser.height = newImage.height;
          countLoaded.current += 1;
          if (countLoaded.current === lasersAll.current.length) {
            countLoaded.current = -1;
            isLoaded.current = true;
          }
        };
      });
    }
    return () => {
      isLoaded.current = true;
    };
  }, []);

  const drawPlayerLasers = () => {
    if (isLoaded.current) {
      shootedPlayerLasers.current.map((laser) => {
        return ctx!.drawImage(laser.image as CanvasImageSource, laser.x, laser.y);
      });
    }
  };

  const updatePlayerLasers = () => {
    if (isLoaded.current) {
      shootedPlayerLasers.current.forEach((laser) => {
        laser.x += laser.speed;
        if (laser.x >= canvasWidth.current! || laser.x <= 0) {
          laser.isDelete = true;
        }
      });
      shootedPlayerLasers.current = shootedPlayerLasers.current.filter((laser) => !laser.isDelete);
      drawPlayerLasers();
    }
  };

  return {
    updatePlayerLasers,
    setPlayerLasers,
    shootedPlayerLasers,
  };
};
