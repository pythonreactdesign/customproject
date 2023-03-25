import { useEffect, useRef } from 'react';

import { LASERSALL, MOBILE } from './gameVariables';

export interface ShootedEnemiesLasers {
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

interface LasersAll {
  name: string;
  image: HTMLImageElement | null;
  src: string;
  width: number;
  height: number;
  strength: number;
  speed: number;
}

export const useEnemiesLasers = (ctx: CanvasRenderingContext2D | null, canvasWidth: React.RefObject<number>) => {
  const lasersAll = useRef<LasersAll[]>(LASERSALL);
  const shootedEnemiesLasers = useRef<ShootedEnemiesLasers[]>([]);
  const isLoaded = useRef(false);
  const countLoaded = useRef(0);

  const setEnemiesLasers = (enemyX: number, enemyY: number, enemyHeight: number, laserName: string, numbersOfLaser: number) => {
    if (isLoaded.current && countLoaded.current === -1) {
      const laser = lasersAll.current.find((laser) => laser.name === laserName)!;
      const newLaser = {
        name: laserName,
        x: enemyX,
        y: numbersOfLaser === 1 ? enemyY + enemyHeight / 2 : enemyY,
        width: laser.width,
        height: laser.height,
        strength: laser.strength,
        speed: laser.speed,
        isDelete: false,
        image: laser.image,
      };
      shootedEnemiesLasers.current.push(newLaser);
      if (numbersOfLaser === 2) {
        const newLaser2 = {
          name: laserName,
          x: enemyX,
          y: enemyY + enemyHeight,
          width: laser.width,
          height: laser.height,
          strength: laser.strength,
          speed: laser.speed,
          isDelete: false,
          image: laser.image,
        };
        shootedEnemiesLasers.current.push(newLaser2);
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

  const drawEnemiesLasers = () => {
    if (isLoaded.current) {
      shootedEnemiesLasers.current.map((laser) => {
        return ctx!.drawImage(laser.image as CanvasImageSource, laser.x, laser.y);
      });
    }
  };

  const updateEnemiesLasers = () => {
    if (isLoaded.current) {
      shootedEnemiesLasers.current.forEach((laser) => {
        laser.x -= laser.speed;
        if (laser.x >= canvasWidth.current! || laser.x <= 0) {
          laser.isDelete = true;
        }
      });
      shootedEnemiesLasers.current = shootedEnemiesLasers.current.filter((laser) => !laser.isDelete);
      drawEnemiesLasers();
    }
  };

  return {
    updateEnemiesLasers,
    setEnemiesLasers,
    shootedEnemiesLasers,
  };
};
