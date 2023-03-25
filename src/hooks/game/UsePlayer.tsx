import { useCallback, useContext, useEffect, useRef } from 'react';

import { PLAYER, PLAYERSHIPS, LASERSALL, SHIELDSALL, EXPLOSALL, PLAYERNEXTALL, AI, ANIMATION, MOBILE } from './gameVariables';
import { useCollisions } from './UseCollisions';
import { useDrawPlayerText } from './UseDrawPlayerText';
import { useEnemies } from './UseEnemies';
import { useEnemiesLasers } from './UseEnemiesLasers';
import { usePlayerLasers } from './UsePlayerLasers';

import { MobileContext } from 'contexts/MobileContext';

export interface Player {
  width: number;
  height: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  maxSpeedX: number;
  maxSpeedY: number;
  ammo: number;
  ammoColor: string;
  shieldStrength: number;
  shieldStrengthOriginal: number;
  numbersOfLaser: number;
  laserName: string;
  laserColor: string;
  score: number;
  image: HTMLImageElement | null;
  isDamaged: boolean;
  isDelete: boolean;

  shieldImage: HTMLImageElement | null;
  shieldName: string;
  shieldWidth: number;
  shieldHeight: number;
  shieldDisplayTime: number;
  animationShieldTimeBuffer: number;

  explosImage: HTMLImageElement | null;
  explosName: string;
  explosWidth: number;
  explosHeight: number;
  explosIsSheet: boolean;
  explosRows: number;
  explosColumns: number;
  explosFrameX: number;
  explosFrameY: number;
  explosFrameWidth: number;
  explosFrameHeight: number;
  explosDisplayTime: number;
  animationExplosTimeBuffer: number;

  nextImage: HTMLImageElement | null;
  nextName: string;
  nextWidth: number;
  nextHeight: number;
  nextIsSheet: boolean;
  nextRows: number;
  nextColumns: number;
  nextFrameX: number;
  nextFrameY: number;
  nextFrameWidth: number;
  nextFrameHeight: number;
  nextDisplayTime: number;
  nextDelayFrames: number;
  animationNextTimeBuffer: number;
  isAnimatingNext: boolean;
}

interface PlayerShips {
  image: HTMLImageElement | null;
  src: string;
  width: number;
  height: number;
  ammo: number;
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

export const usePlayer = (
  ctx: CanvasRenderingContext2D | null,
  isAnimateCanvas: React.RefObject<boolean>,
  canvasWidth: React.RefObject<number>,
  canvasHeight: React.RefObject<number>,
  canvasY: React.RefObject<number>,
  gameLevels: React.RefObject<number>,
  isGameLevelChanged: React.RefObject<boolean>,
  deltaTime: React.RefObject<number>,
) => {
  const playerShips = useRef<PlayerShips[]>(PLAYERSHIPS);
  const player = useRef<Player>(PLAYER);
  const keysRef = useRef<string[]>([]);
  const isLoaded = useRef(false);
  const isSet = useRef(false);
  const countLoaded = useRef(0);
  const { isMobile } = useContext(MobileContext);

  const deltaCounter = useRef(0);

  const { updateEnemies, setEnemies, enemies } = useEnemies(
    ctx,
    player,
    canvasWidth,
    canvasHeight,
    gameLevels,
    isGameLevelChanged,
  );
  const { updatePlayerLasers, setPlayerLasers, shootedPlayerLasers } = usePlayerLasers(ctx, canvasWidth);
  const { updateEnemiesLasers, setEnemiesLasers, shootedEnemiesLasers } = useEnemiesLasers(ctx, canvasWidth);
  const {
    isCollisionPlayerWithEnemies,
    isCollisionPlayerLaserWithEnemies,
    isCollisionEnemiesLaserWithPlayer,
    isCollisionsLasers,
  } = useCollisions(player, enemies, shootedPlayerLasers, shootedEnemiesLasers);
  const { drawAmmo, drawShieldStrength, drawLevels, drawScore, drawTime } = useDrawPlayerText(
    ctx,
    player,
    canvasWidth,
    canvasHeight,
    gameLevels,
  );

  const setPlayer = () => {
    if ((!isSet.current && countLoaded.current === -1) || isGameLevelChanged.current) {
      const ship = playerShips.current[gameLevels.current!];
      player.current.width = ship.width;
      player.current.height = ship.height;
      player.current.x = 0;
      player.current.y = (canvasHeight.current! - ship.height) / 2;
      player.current.ammo = !isMobile ? ship.ammo : MOBILE.ammo[gameLevels.current!];
      player.current.shieldStrength = ship.shieldStrength;
      player.current.shieldStrengthOriginal = ship.shieldStrength;
      player.current.numbersOfLaser = ship.numbersOfLaser;
      player.current.laserName = ship.laserName;
      player.current.laserColor = LASERSALL.find((laserAll) => laserAll.name === ship.laserName)!.color;
      player.current.image = ship.image;

      const playerShield = SHIELDSALL.find((shield) => shield.name === ship.shieldName)!;
      player.current.shieldName = ship.shieldName;
      player.current.shieldDisplayTime = playerShield.displayTime;
      player.current.animationShieldTimeBuffer === 0;
      player.current.shieldImage = ship.shieldImage;
      player.current.shieldWidth = ship.shieldImage!.width;
      player.current.shieldHeight = ship.shieldImage!.height;

      const playerExplos = EXPLOSALL.find((explos) => explos.name === ship.explosName)!;
      const explosRows = playerExplos.rows;
      const explosColumns = playerExplos.columns;
      player.current.explosName = ship.explosName;
      player.current.explosDisplayTime = playerExplos.displayTime;
      player.current.animationExplosTimeBuffer === 0;
      player.current.explosImage = ship.explosImage;
      player.current.explosWidth = ship.explosWidth;
      player.current.explosHeight = ship.explosHeight;
      player.current.explosIsSheet = playerExplos.isSheet;
      player.current.explosRows = explosRows;
      player.current.explosColumns = explosColumns;
      player.current.explosFrameWidth = ship.explosWidth / explosColumns;
      player.current.explosFrameHeight = ship.explosHeight / explosRows;

      const playerNext = PLAYERNEXTALL.find((next) => next.name === player.current.nextName)!;
      const nextRows = playerNext.rows;
      const nextColumns = playerNext.columns;
      const playerNextAnimImage = new Image();
      playerNextAnimImage.src = playerNext.src;
      playerNextAnimImage.onload = () => {
        player.current.nextImage = playerNextAnimImage;
        player.current.nextWidth = playerNextAnimImage.width;
        player.current.nextHeight = playerNextAnimImage.height;
        player.current.nextIsSheet = playerNext.isSheet;
        player.current.nextRows = playerNext.rows;
        player.current.nextColumns = playerNext.columns;
        player.current.nextFrameWidth = playerNextAnimImage.width / nextColumns;
        player.current.nextFrameHeight = playerNextAnimImage.height / nextRows;
        player.current.nextDelayFrames = playerNext.delayFrames;
        player.current.nextDisplayTime = playerNext.displayTime;
      };
    }
    isSet.current = true;
  };

  useEffect(() => {
    if (!isLoaded.current && typeof window !== 'undefined') {
      const isSmallDisplay = window.innerWidth * window.innerHeight < MOBILE.smallerPixels;
      playerShips.current.forEach((ship) => {
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
              if (countLoaded.current === playerShips.current.length) {
                countLoaded.current = -1;
                isLoaded.current = true;
                setPlayer();
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

  const shooting = useCallback(() => {
    if (isSet.current && isAnimateCanvas.current && !player.current.isDelete && player.current.ammo > 0) {
      setPlayerLasers(
        player.current.x,
        player.current.y,
        player.current.width,
        player.current.height,
        player.current.laserName,
        player.current.numbersOfLaser,
      );
      player.current.ammo -= player.current.numbersOfLaser === 1 ? 1 : 2;
    }
  }, [isAnimateCanvas.current, player.current.ammo]);

  const drawPlayer = () => {
    if (isSet.current && isAnimateCanvas.current) {
      ctx!.drawImage(player.current.image as CanvasImageSource, player.current.x, player.current.y);
    }
  };

  const drawPlayerShield = () => {
    ctx!.drawImage(
      player.current.shieldImage as CanvasImageSource,
      player.current.x - (player.current.shieldWidth - player.current.width) / 2,
      player.current.y - (player.current.shieldHeight - player.current.height) / 2,
    );
  };

  const drawPlayerExplos = () => {
    if (!player.current.explosIsSheet) {
      ctx!.drawImage(
        player.current.explosImage as CanvasImageSource,
        player.current.x - (player.current.explosWidth - player.current.width) / 2,
        player.current.y - (player.current.explosHeight - player.current.height) / 2,
      );
    } else {
      ctx!.drawImage(
        player.current.explosImage as CanvasImageSource,
        player.current.explosFrameX * player.current.explosFrameWidth,
        player.current.explosFrameY * player.current.explosFrameHeight,
        player.current.explosFrameWidth,
        player.current.explosFrameHeight,
        player.current.x,
        player.current.y,
        player.current.explosFrameWidth,
        player.current.explosFrameHeight,
      );

      if (player.current.explosRows !== 1) {
        player.current.explosFrameY =
          (player.current.explosFrameY + ~~(player.current.explosFrameX / (player.current.explosColumns - 1))) %
          player.current.explosRows;
      }
      player.current.explosFrameX = (player.current.explosFrameX + 1) % player.current.explosColumns;
    }
  };

  const drawPlayerNextAnim = (deltaTime: number) => {
    if (!player.current.nextIsSheet) {
      ctx!.drawImage(
        player.current.nextImage as CanvasImageSource,
        player.current.x - (player.current.nextWidth - player.current.width) / 2,
        player.current.y - (player.current.nextHeight - player.current.height) / 2,
      );
    } else {
      ctx!.drawImage(
        player.current.nextImage as CanvasImageSource,
        player.current.nextFrameX * player.current.nextFrameWidth,
        player.current.nextFrameY * player.current.nextFrameHeight,
        player.current.nextFrameWidth,
        player.current.nextFrameHeight,
        player.current.x,
        player.current.y,
        player.current.nextFrameWidth,
        player.current.nextFrameHeight,
      );

      if (player.current.animationNextTimeBuffer >= player.current.nextDelayFrames) {
        if (player.current.nextRows !== 1) {
          player.current.nextFrameY =
            (player.current.nextFrameY + ~~(player.current.nextFrameX / (player.current.nextColumns - 1))) %
            player.current.nextRows;
        }
        player.current.nextFrameX = (player.current.nextFrameX + 1) % player.current.nextColumns;
        player.current.animationNextTimeBuffer = 0;
      } else {
        player.current.animationNextTimeBuffer += deltaTime;
      }
    }
  };

  const updatePlayer = (playingTimeCounter: number, deltaTimeCounter: number, deltaTime: number) => {
    if (isSet.current && isAnimateCanvas.current) {
      if (!isMobile) {
        if (keysRef.current.includes('ArrowUp')) {
          player.current.speedY = -player.current.maxSpeedY;
        } else if (keysRef.current.includes('ArrowDown')) {
          player.current.speedY = player.current.maxSpeedY;
        } else player.current.speedY = 0;

        if (keysRef.current.includes('ArrowLeft')) {
          player.current.speedX = -player.current.maxSpeedX;
        } else if (keysRef.current.includes('ArrowRight')) {
          player.current.speedX = player.current.maxSpeedX;
        } else player.current.speedX = 0;

        player.current.x += player.current.speedX;
        player.current.y += player.current.speedY;

        if (player.current.x < 0) {
          player.current.x = 0;
        } else if (player.current.x > canvasWidth.current! - player.current.width) {
          player.current.x = canvasWidth.current! - player.current.width;
        }

        if (player.current.y < 0) {
          player.current.y = 0;
        } else if (player.current.y > canvasHeight.current! - player.current.height) {
          player.current.y = canvasHeight.current! - player.current.height;
        }
      }

      if (enemies.current.length > 0) {
        if (Math.random() >= 1 - AI.enemiesShootingLaser[gameLevels.current!]) {
          const index = Math.floor(Math.random() * enemies.current.length);
          const enemy = enemies.current[index];
          if (!enemy.isExplos) {
            setEnemiesLasers(enemy.x, enemy.y, enemy.height, enemy.laserName, enemy.numbersOfLaser);
          }
        }
      }
      drawAmmo();
      drawShieldStrength();
      drawLevels();
      drawScore();
      drawTime(playingTimeCounter);

      updateEnemies(deltaTimeCounter);
      updatePlayerLasers();
      updateEnemiesLasers();

      isCollisionPlayerWithEnemies(deltaTimeCounter);
      isCollisionPlayerLaserWithEnemies(deltaTimeCounter);
      isCollisionEnemiesLaserWithPlayer(deltaTimeCounter);
      isCollisionsLasers();

      if (player.current.isDelete && !player.current.isAnimatingNext) {
        if (ANIMATION.isPlayerExplosion) {
          player.current.shieldStrength = player.current.shieldStrengthOriginal;
          if (player.current.animationExplosTimeBuffer + player.current.explosDisplayTime > deltaTimeCounter) {
            drawPlayerExplos();
          } else {
            player.current.animationExplosTimeBuffer = 0;
            player.current.score += AI.playerDeleteScore;
            player.current.isDelete = false;
            player.current.explosFrameX = 0;
            player.current.explosFrameY = 0;
          }
        } else {
          player.current.score -= 100;
          player.current.shieldStrength = player.current.shieldStrengthOriginal;
          player.current.isDamaged = true;
          player.current.isDelete = false;
          player.current.animationShieldTimeBuffer = deltaTimeCounter;
        }
      }

      if (player.current.isDamaged && !player.current.isAnimatingNext) {
        if (player.current.animationShieldTimeBuffer + player.current.shieldDisplayTime > deltaTimeCounter) {
          drawPlayerShield();
        } else player.current.isDamaged = false;
      }

      if (playingTimeCounter <= player.current.nextDisplayTime) {
        player.current.isAnimatingNext = true;
        player.current.isDelete = false;
        player.current.isDamaged = false;
        drawPlayerNextAnim(deltaTime);
      } else {
        drawPlayer();
      }
    }
  };

  const reloadPlayerEnemies = () => {
    shootedPlayerLasers.current = shootedPlayerLasers.current.filter((laser) => laser.isDelete);
    shootedEnemiesLasers.current = shootedPlayerLasers.current.filter((laser) => laser.isDelete);
    player.current.animationShieldTimeBuffer = 0;
    player.current.animationExplosTimeBuffer = 0;
    player.current.animationNextTimeBuffer = 0;
    player.current.isDamaged = false;
    player.current.isDelete = false;
    player.current.isAnimatingNext = false;
    enemies.current.forEach((enemy) => {
      enemy.animationShieldTimeBuffer = 0;
      enemy.animationShieldTimeBuffer = 0;
      enemy.isExplos = false;
      enemy.isDelete = true;
    });
    setPlayer();
    setEnemies(AI.numberOfEnemies[gameLevels.current!], false);
  };

  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (
        (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
        keysRef.current.indexOf(e.key) === -1
      ) {
        keysRef.current.push(e.key);
      } else if (e.key === ' ') {
        shooting();
      }
    },
    [keysRef.current],
  );

  const keyUpHandler = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      const index = keysRef.current.indexOf(e.key);
      if (index > -1) {
        keysRef.current.splice(index, 1);
      }
    },
    [keysRef.current],
  );

  const touchMoveHandler = useCallback((e: TouchEvent) => {
    deltaCounter.current += deltaTime!.current!;
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const idx = touches[i].identifier;
      if (idx >= 0) {
        player.current.y = e.touches[i].clientY - canvasY.current!;
        if (player.current.y < 0) player.current.y = 0;
        if (player.current.y > canvasHeight.current! - player.current.height) {
          player.current.y = canvasHeight.current! - player.current.height;
        }
        if (
          e.touches[0].clientX > player.current.x + player.current.width &&
          deltaCounter.current > MOBILE.shootingDeltaTime &&
          !player.current.isAnimatingNext &&
          !player.current.isDelete
        ) {
          shooting();
          deltaCounter.current = 0;
        }
      }
    }
  }, []);

  const touchStartHandler = useCallback((e: TouchEvent) => {
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const idx = touches[i].identifier;
      if (idx >= 0) {
        const touchesY = e.touches[i].clientY - canvasY.current!;
        const touchesX = e.touches[i].clientX;
        if (
          touchesY > player.current.y &&
          touchesY < player.current.y + player.current.height &&
          touchesX > player.current.x &&
          touchesX < player.current.x + player.current.width
        ) {
          document.addEventListener('touchmove', touchMoveHandler);
        }
      }
    }
  }, []);

  const touchEndHandler = useCallback(() => {
    document.removeEventListener('touchmove', touchMoveHandler);
  }, []);

  useEffect(() => {
    if (isSet.current && isAnimateCanvas.current) {
      if (!isMobile) {
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);
      } else {
        document.addEventListener('touchstart', touchStartHandler);
        document.addEventListener('touchend', touchEndHandler);
      }
    } else {
      return () => {
        if (!isMobile) {
          document.removeEventListener('keydown', keyDownHandler);
          document.removeEventListener('keyup', keyUpHandler);
        } else {
          document.removeEventListener('touchstart', touchStartHandler);
          document.removeEventListener('touchend', touchEndHandler);
        }
      };
    }
  }, [isSet.current, isAnimateCanvas.current]);

  return {
    updatePlayer,
    reloadPlayerEnemies,
    keyDownHandler,
    keyUpHandler,
    touchStartHandler,
    touchEndHandler,
  };
};
