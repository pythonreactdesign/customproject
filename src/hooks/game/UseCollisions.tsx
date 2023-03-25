import React from 'react';

import { LASERSALL } from './gameVariables';
import type { Enemies } from './UseEnemies';
import type { ShootedEnemiesLasers } from './UseEnemiesLasers';
import type { Player } from './UsePlayer';
import type { ShootedPlayerLasers } from './UsePlayerLasers';

export const useCollisions = (
  player: React.RefObject<Player>,
  enemies: React.RefObject<Enemies[]>,
  shootedPlayerLasers: React.RefObject<ShootedPlayerLasers[]>,
  shootedEnemiesLasers: React.RefObject<ShootedEnemiesLasers[]>,
) => {
  const isCollisionRect = (
    prop1X: number,
    prop1Y: number,
    prop1Width: number,
    prop1Height: number,
    prop2X: number,
    prop2Y: number,
    prop2Width: number,
    prop2Height: number,
  ) => {
    return (
      prop1X < prop2X + prop2Width &&
      prop1X + prop1Width > prop2X &&
      prop1Y < prop2Y + prop2Height &&
      prop1Height + prop1Y > prop2Y
    );
  };

  const isCollisionPlayerLaserWithEnemies = (deltaTimeCounter: number) => {
    shootedPlayerLasers.current!.forEach((laser) => {
      enemies.current!.forEach((enemy) => {
        if (isCollisionRect(enemy.x, enemy.y, enemy.width, enemy.height, laser.x, laser.y, laser.width, laser.height)) {
          laser.isDelete = true;
          if (!enemy.isExplos) {
            if (enemy.shieldStrength <= laser.strength) {
              enemy.isExplos = true;
              enemy.animationExplosTimeBuffer = deltaTimeCounter;
            } else {
              enemy.shieldStrength -= laser.strength;
              enemy.isDamaged = true;
              enemy.animationShieldTimeBuffer = deltaTimeCounter;
            }
            player.current!.score += enemy.score;
          }
        }
      });
    });
  };

  const isCollisionPlayerWithEnemies = (deltaTimeCounter: number) => {
    enemies.current!.forEach((enemy) => {
      if (
        isCollisionRect(
          player.current!.x,
          player.current!.y,
          player.current!.width,
          player.current!.height,
          enemy.x,
          enemy.y,
          enemy.width,
          enemy.height,
        )
      ) {
        if (!enemy.isExplos) {
          enemy.isExplos = true;
          enemy.animationExplosTimeBuffer = deltaTimeCounter;
        }
        player.current!.isDelete = true;
        player.current!.animationExplosTimeBuffer = deltaTimeCounter;
      }
    });
  };

  const isCollisionEnemiesLaserWithPlayer = (deltaTimeCounter: number) => {
    shootedEnemiesLasers.current!.forEach((laser) => {
      if (
        isCollisionRect(
          player.current!.x,
          player.current!.y,
          player.current!.width,
          player.current!.height,
          laser.x,
          laser.y,
          laser.width,
          laser.height,
        )
      ) {
        laser.isDelete = true;
        if (player.current!.shieldStrength <= laser.strength) {
          player.current!.shieldStrength = 0;
          player.current!.isDelete = true;
          player.current!.animationExplosTimeBuffer = deltaTimeCounter;
        } else {
          player.current!.shieldStrength -= laser.strength;
          player.current!.isDamaged = true;
          player.current!.animationShieldTimeBuffer = deltaTimeCounter;
        }
      }
    });
  };

  const isCollisionsLasers = () => {
    shootedPlayerLasers.current!.forEach((playerLaser) => {
      shootedEnemiesLasers.current!.forEach((enemiesLaser) => {
        if (
          isCollisionRect(
            enemiesLaser.x,
            enemiesLaser.y,
            enemiesLaser.width,
            enemiesLaser.height,
            playerLaser.x,
            playerLaser.y,
            playerLaser.width,
            playerLaser.height,
          )
        ) {
          if (enemiesLaser.strength < playerLaser.strength) {
            playerLaser.strength -= enemiesLaser.strength;
            if (playerLaser.name === LASERSALL[1].name) {
              playerLaser.image = LASERSALL[0].image;
            } else if (playerLaser.name === LASERSALL[3].name) {
              playerLaser.image = LASERSALL[2].image;
            }
            player.current!.score += enemiesLaser.strength;
            enemiesLaser.isDelete = true;
          } else {
            if (playerLaser.strength < enemiesLaser.strength) {
              enemiesLaser.strength -= playerLaser.strength;
              if (enemiesLaser.name === LASERSALL[1].name) {
                enemiesLaser.image = LASERSALL[0].image;
              } else if (enemiesLaser.name === LASERSALL[3].name) {
                enemiesLaser.image = LASERSALL[2].image;
              }
              playerLaser.isDelete = true;
            } else {
              enemiesLaser.isDelete = true;
              playerLaser.isDelete = true;
            }
          }
        }
      });
    });
  };
  return {
    isCollisionPlayerWithEnemies,
    isCollisionPlayerLaserWithEnemies,
    isCollisionEnemiesLaserWithPlayer,
    isCollisionsLasers,
  };
};
