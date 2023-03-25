import { useEffect, useRef } from 'react';

import { ENEMYSHIPS, SHIELDSALL, EXPLOSALL, AI, ANIMATION, MOBILE } from './gameVariables';
import type { Player } from './UsePlayer';

export interface Enemies {
  width: number;
  height: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  score: number;
  shieldStrength: number;
  numbersOfLaser: number;
  laserName: string;
  isDelete: boolean;
  image: HTMLImageElement | null;
  isDamaged: boolean;
  shieldImage: HTMLImageElement | null;
  shieldName: string;
  shieldWidth: number;
  shieldHeight: number;
  shieldDisplayTime: number;
  animationShieldTimeBuffer: number;
  isExplos: boolean;
  explosImage: HTMLImageElement | null;
  explosName: string;
  explosWidth: number;
  explosHeight: number;
  explosIsSheet: boolean;
  explosRows: number;
  explosColumns: number;
  explosDisplayTime: number;
  animationExplosTimeBuffer: number;
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
}

interface EnemyShips {
  image: HTMLImageElement | null;
  src: string;
  width: number;
  height: number;
  score: number;
  shieldStrength: number;
  laserName: string;
  numbersOfLaser: number;
  shieldImage: HTMLImageElement | null;
  shieldName: string;
  explosImage: HTMLImageElement | null;
  explosName: string;
  explosWidth: number;
  explosHeight: number;
}

export const useEnemies = (
  ctx: CanvasRenderingContext2D | null,
  player: React.RefObject<Player>,
  canvasWidth: React.RefObject<number>,
  canvasHeight: React.RefObject<number>,
  gameLevels: React.RefObject<number>,
  isGameLevelChanged: React.RefObject<boolean>,
) => {
  const enemyShips = useRef<EnemyShips[]>(ENEMYSHIPS);
  const enemies = useRef<Enemies[]>([]);
  const isLoaded = useRef(false);
  const countLoaded = useRef(0);
  const isSet = useRef(false);

  const setEnemies = (numbers: number, isRecruitment: boolean) => {
    if ((!isSet.current && countLoaded.current === -1) || isGameLevelChanged.current || isRecruitment) {
      for (let i = 0; i < numbers; i++) {
        const index = ~~(Math.random() * (AI.chooseableEnemiesShip[gameLevels.current!] + 1));
        const ship = enemyShips.current[index];
        const enemyShield = SHIELDSALL.find((shield) => shield.name === ship.shieldName)!;
        const enemyExplos = EXPLOSALL.find((explos) => explos.name === ship.explosName)!;
        const rows = EXPLOSALL.find((explos) => explos.name === ship.explosName)!.rows;
        const columns = EXPLOSALL.find((explos) => explos.name === ship.explosName)!.columns;

        const newEnemy = {
          width: ship.width,
          height: ship.height,
          x: canvasWidth.current!,
          y: Math.random() * (canvasHeight.current! - ship.height - 60) + 60,
          speedX: Math.random() * AI.enemiesSpeedXMax[gameLevels.current!] + AI.enemiesSpeedXMin[gameLevels.current!],
          speedY: 0,
          score: ship.score,
          shieldStrength: ship.shieldStrength,
          numbersOfLaser: ship.numbersOfLaser,
          laserName: ship.laserName,
          isDelete: false,
          image: ship.image,
          isDamaged: false,

          shieldName: ship.shieldName,
          shieldDisplayTime: enemyShield.displayTime,
          animationShieldTimeBuffer: 0,
          shieldImage: ship.shieldImage,
          shieldWidth: ship.shieldImage!.width,
          shieldHeight: ship.shieldImage!.height,

          explosName: ship.explosName,
          explosDisplayTime: enemyExplos.displayTime,
          animationExplosTimeBuffer: 0,
          explosImage: ship.explosImage,
          explosWidth: ship.explosWidth,
          explosHeight: ship.explosHeight,
          explosIsSheet: enemyExplos.isSheet,
          explosRows: rows,
          explosColumns: columns,
          frameX: 0,
          frameY: 0,
          isExplos: false,
          frameWidth: ship.explosWidth / columns,
          frameHeight: ship.explosHeight / rows,
        };
        enemies.current.push(newEnemy);
      }
    }
    isSet.current = true;
  };

  useEffect(() => {
    if (!isLoaded.current && typeof window !== 'undefined') {
      const isSmallDisplay = window.innerWidth * window.innerHeight < MOBILE.smallerPixels;
      enemyShips.current.forEach((ship) => {
        const newImage = new Image();
        newImage.src = isSmallDisplay ? ship.src.split('.png')[0] + 'Mobile.png' : ship.src;
        newImage.onerror = () => {
          newImage.onerror = null;
          newImage.src = ship.src;
        };
        newImage.onload = () => {
          ship.image = newImage;
          ship.width = newImage.width;
          ship.height = newImage.height;

          const newShieldImage = new Image();
          const src = SHIELDSALL.find((shield) => shield.name === ship.shieldName)!.src;
          newShieldImage.src = isSmallDisplay ? src.split('.png')[0] + 'Mobile.png' : src;
          newShieldImage.onerror = () => {
            newShieldImage.onerror = null;
            newShieldImage.src = src;
          };

          newShieldImage.onload = () => {
            ship.shieldImage = newShieldImage;

            const newExplosImage = new Image();
            newExplosImage.src = EXPLOSALL.find((explos) => explos.name === ship.explosName)!.src;
            newExplosImage.onload = () => {
              ship.explosImage = newExplosImage;
              ship.explosWidth = newExplosImage.width;
              ship.explosHeight = newExplosImage.height;
              countLoaded.current += 1;
              if (countLoaded.current === enemyShips.current.length) {
                countLoaded.current = -1;
                isLoaded.current = true;
                setEnemies(AI.numberOfEnemies[gameLevels.current!], false);
              }
            };
          };
        };
      });
    }
    return () => {
      isLoaded.current = true;
    };
  }, []);

  const drawEnemies = () => {
    if (isSet.current) {
      enemies.current.forEach((enemy) => {
        if (!enemy.isExplos) {
          ctx!.drawImage(enemy.image as CanvasImageSource, enemy.x, enemy.y);
        }
      });
    }
  };

  const drawEnemyShield = (enemy: Enemies) => {
    ctx!.drawImage(
      enemy.shieldImage as CanvasImageSource,
      enemy.x - (enemy.shieldWidth - enemy.width) / 2,
      enemy.y - (enemy.shieldHeight - enemy.height) / 2,
    );
  };

  const drawEnemyExplos = (enemy: Enemies) => {
    if (!enemy.explosIsSheet) {
      ctx!.drawImage(
        enemy.explosImage as CanvasImageSource,
        enemy.x - (enemy.explosWidth - enemy.width) / 2,
        enemy.y - (enemy.explosHeight - enemy.height) / 2,
      );
    } else {
      ctx!.drawImage(
        enemy.explosImage as CanvasImageSource,
        enemy.frameX * enemy.frameWidth,
        enemy.frameY * enemy.frameHeight,
        enemy.frameWidth,
        enemy.frameHeight,
        enemy.x,
        enemy.y,
        enemy.frameWidth,
        enemy.frameHeight,
      );

      enemy.frameY = (enemy.frameY + ~~(enemy.frameX / (enemy.explosColumns - 1))) % enemy.explosRows;
      enemy.frameX = (enemy.frameX + 1) % enemy.explosColumns;
    }
  };

  const updateEnemies = (deltaTimeCounter: number) => {
    if (isSet.current) {
      enemies.current.forEach((enemy) => {
        enemy.x += enemy.speedX;
        if (enemy.x <= 0) {
          player.current!.score -= enemy.score;
          enemy.isDelete = true;
        }
      });

      enemies.current.forEach((enemy) => {
        if (enemy.isExplos) {
          if (ANIMATION.isEnemyExplosion) {
            if (enemy.animationExplosTimeBuffer + enemy.explosDisplayTime > deltaTimeCounter) {
              drawEnemyExplos(enemy);
            } else {
              enemy.animationExplosTimeBuffer = 0;
              enemy.isExplos = false;
              enemy.isDelete = true;
              enemy.frameX = 0;
              enemy.frameY = 0;
            }
          } else {
            enemy.isDelete = true;
          }
        }
      });

      enemies.current = enemies.current.filter((enemy) => !enemy.isDelete);

      const enemiesDeletedCounter = AI.numberOfEnemies[gameLevels.current!] - enemies.current.length;
      if (enemiesDeletedCounter % AI.enemiesRecruitment.deleted[gameLevels.current!] === 0) {
        setEnemies(
          // eslint-disable-next-line prettier/prettier
          (enemiesDeletedCounter / AI.enemiesRecruitment.deleted[gameLevels.current!]) * AI.enemiesRecruitment.added[gameLevels.current!], true,
        );
      }

      enemies.current.forEach((enemy) => {
        if (enemy.isDamaged) {
          if (enemy.animationShieldTimeBuffer + enemy.shieldDisplayTime > deltaTimeCounter) {
            drawEnemyShield(enemy);
          } else enemy.isDamaged = false;
        }
      });
      drawEnemies();
    }
  };
  return { updateEnemies, setEnemies, enemies };
};
