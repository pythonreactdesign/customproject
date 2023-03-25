import { useRouter } from 'next/router';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

import styles from 'styles/Game.module.scss';
import { URLS } from 'utils/urls';

import { GAME, BACKGROUNDS, ANIMATION } from './gameVariables';
import { useBackgrounds } from './UseBackground';
import { useDrawGameText } from './UseDrawGameText';
import { usePlayer } from './UsePlayer';

export const useGame = (isPressSpace: boolean) => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const isInit = useRef(true);
  const canvasY = useRef(0);
  const isAnimateCanvas = useRef(true);
  const deltaTime = useRef(0);
  const deltaTimeCounter = useRef(0);
  const playingTimeCounter = useRef(0);
  const requestAnimationRef = useRef<number | null>(null);
  const timeValueRef = useRef(Date.now());
  const isGameEnd = useRef(false);
  const gameLevels = useRef(0);
  const isGameLevelChanged = useRef(false);
  const canvasWidth = useRef(0);
  const canvasHeight = useRef(0);
  const numberOfLevels = GAME.levelTime.length;

  const { updatePlayer, reloadPlayerEnemies, keyDownHandler, keyUpHandler } = usePlayer(
    ctx,
    isAnimateCanvas,
    canvasWidth,
    canvasHeight,
    canvasY,
    gameLevels,
    isGameLevelChanged,
    deltaTime,
  );
  const { drawTextScroll, drawTextNextLevel, drawTextArrow } = useDrawGameText(canvasWidth, canvasHeight);
  const { setBackground, updateBackground, drawBackground } = useBackgrounds(
    ctx,
    isAnimateCanvas,
    canvasWidth,
    canvasHeight,
    gameLevels,
    isGameLevelChanged,
  );

  const setCanvasBackground = useCallback(
    (canvas: HTMLCanvasElement) => {
      canvas.style.background = 'url(' + BACKGROUNDS[gameLevels.current].src + ')';
      canvas.style.backgroundSize = 'cover';
    },
    [gameLevels.current],
  );

  const isBackgroundScroll = useMemo(() => {
    if (canvasWidth.current && canvasHeight.current) {
      return (
        (ANIMATION.isBackgroundScrollOnBigDisplay && canvasWidth.current * canvasHeight.current >= ANIMATION.bigDisplay) ||
        (ANIMATION.isBackgroundScrollOnSmallDisplay && canvasWidth.current * canvasHeight.current < ANIMATION.bigDisplay)
      );
    }
  }, [
    ANIMATION.isBackgroundScrollOnBigDisplay,
    ANIMATION.isBackgroundScrollOnSmallDisplay,
    ANIMATION.bigDisplay,
    canvasWidth.current,
    canvasHeight.current,
  ]);

  const initCanvas = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      setCtx(ctx);
      canvas.style.position = 'absolute';
      const parent = canvas.parentNode;
      const parentStyles = getComputedStyle(parent as Element);
      const width = parseInt(parentStyles.getPropertyValue('width'), 10);
      const height = parseInt(parentStyles.getPropertyValue('height'), 10);
      canvasWidth.current = width;
      canvasHeight.current = height;
      canvas.width = width;
      canvas.height = height;
      if (!isBackgroundScroll) setCanvasBackground(canvas);
      canvasY.current = document.getElementById('menu')!.clientHeight;
    }
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && isInit.current) {
      initCanvas();
      isInit.current = false;
    }
    window.addEventListener('resize', initCanvas);
    return () => {
      window.removeEventListener('resize', initCanvas);
    };
  }, [canvasRef, isInit.current, initCanvas]);

  const animateGame = useCallback(() => {
    if (isAnimateCanvas.current && isPressSpace && ctx) {
      deltaTime.current = Date.now() - timeValueRef.current;
      timeValueRef.current = Date.now();
      deltaTimeCounter.current += deltaTime.current;
      playingTimeCounter.current -= deltaTime.current;

      if (isGameEnd.current) {
        cancelAnimationFrame(requestAnimationRef.current!);
        requestAnimationRef.current = null;
        ctx.clearRect(0, 0, canvasWidth.current, canvasHeight.current);
        isAnimateCanvas.current = false;
        isGameEnd.current = true;
        document.removeEventListener('keydown', keyDownHandler);
        document.removeEventListener('keyup', keyUpHandler);
        router.push(URLS.contact);
        return;
      } else {
        if (deltaTimeCounter.current < GAME.levelTime[gameLevels.current]) {
          ctx.clearRect(0, 0, canvasWidth.current, canvasHeight.current);
          if (isBackgroundScroll) updateBackground();
          drawTextScroll(ctx);
          drawTextArrow(ctx);
          updatePlayer(playingTimeCounter.current, deltaTimeCounter.current, deltaTime.current);
        } else {
          if (deltaTimeCounter.current <= GAME.levelTime[gameLevels.current] + GAME.levelTextTime[gameLevels.current]) {
            ctx.clearRect(0, 0, canvasWidth.current, canvasHeight.current);
            if (isBackgroundScroll) drawBackground();
            drawTextNextLevel(ctx, gameLevels, deltaTimeCounter);
          } else {
            if (gameLevels.current < numberOfLevels - 1 && !isGameLevelChanged.current) {
              ctx.clearRect(0, 0, canvasWidth.current, canvasHeight.current);
              gameLevels.current += 1;
              isGameLevelChanged.current = true;
              if (isBackgroundScroll) {
                setBackground();
              } else {
                setCanvasBackground(canvasRef.current!);
              }
              reloadPlayerEnemies();
              isGameLevelChanged.current = false;
              playingTimeCounter.current =
                GAME.levelTime[gameLevels.current] -
                GAME.levelTime[gameLevels.current - 1] -
                GAME.levelTextTime[gameLevels.current - 1];
            } else {
              isGameEnd.current = true;
            }
          }
        }
        requestAnimationRef.current = requestAnimationFrame(animateGame);
      }
    }
  }, [
    ctx,
    canvasHeight.current,
    canvasWidth.current,
    gameLevels.current,
    isGameLevelChanged.current,
    isGameEnd.current,
    updatePlayer,
  ]);

  useEffect(() => {
    if (!isAnimateCanvas.current && isPressSpace) {
      isAnimateCanvas.current = true;
    }
    if (isAnimateCanvas.current) {
      playingTimeCounter.current = GAME.levelTime[0];
      timeValueRef.current = Date.now();
      requestAnimationRef.current = requestAnimationFrame(animateGame);
    }
    return () => {
      cancelAnimationFrame(requestAnimationRef.current!);
    };
  }, [isAnimateCanvas.current, isPressSpace, animateGame]);

  const Game = () => {
    return (
      <div className={styles.wrapper} id="canvasWrapper">
        <canvas className={styles.canvas1} ref={canvasRef} id="canvas" />
      </div>
    );
  };
  return { Game };
};
