import { useTranslation } from 'next-i18next';
import React, { useCallback, useRef } from 'react';

import { GAME, TEXTSCROLL, TEXTARROW, TEXTCOMPANY, TEXTNEXTLEVEL, TEXTNEXTLEVEL0, TEXTNEXTLEVEL1 } from './gameVariables';

interface TextVariable {
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  color: string;
  align: string;
  positionX: number;
  positionY: number;
}

export const useDrawGameText = (canvasWidth: React.RefObject<number>, canvasHeight: React.RefObject<number>) => {
  const { t } = useTranslation('home');
  const textCompany = [t('gameLevel1'), t('gameLevel2'), t('gameLevel3')];
  const textNextLevel = t('textNextLevel');
  const textNextLevel0 = t('textNextLevel0');
  const textNextLevel1 = t('textNextLevel1');
  const textScroll = t('textScroll');
  const textArrow = t('textArrow');
  const isTextGameScroll = useRef(false);
  const textScrollPositionX = useRef(0);
  const textScrollWidth = useRef(0);

  const drawing = (
    ctx: CanvasRenderingContext2D | null,
    textVariable: TextVariable,
    text: string,
    positionX: number,
    positionY: number,
    isWrapper: boolean,
    flexibleFontSize: boolean,
  ) => {
    const fontSize = textVariable.fontSize * (canvasWidth.current! + canvasHeight.current!) + 'px';
    const setFont = (size: string) => {
      return 'normal' + ' ' + textVariable.fontWeight + ' ' + size + ' ' + textVariable.fontFamily;
    };
    ctx!.font = setFont(fontSize);
    ctx!.fillStyle = textVariable.color;
    ctx!.textAlign = textVariable.align as CanvasTextAlign;
    let size = fontSize.split('px')[0];
    if (!isWrapper) {
      if (flexibleFontSize) {
        while (ctx!.measureText(text).width > canvasWidth.current! * 0.95) {
          size = (parseInt(size.split('px')[0]) * 0.9).toString() + 'px';
          ctx!.font = setFont(size);
        }
      }
      ctx!.fillText(text, positionX, positionY);
    } else drawWrapperText(ctx!, text);
  };

  const drawWrapperText = (ctx: CanvasRenderingContext2D, text: string) => {
    const linesArray = [];
    let lineCounter = 0;
    let line = '';
    const words = text.split(' ');
    const lineHeight = ctx.measureText('M').width * TEXTCOMPANY.lineHeightModifier;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      if (ctx.measureText(testLine).width > canvasWidth.current! * 0.95) {
        line = words[i] + ' ';
        lineCounter += 1;
      } else {
        line = testLine;
      }
      linesArray[lineCounter] = line;
    }
    const textHeight = lineHeight * lineCounter;
    const textY = TEXTCOMPANY.positionY * canvasHeight.current! - textHeight / 2;
    linesArray.forEach((element, index) => {
      ctx.fillText(element, canvasWidth.current! / 2, textY + index * lineHeight);
    });
  };

  const drawTextScroll = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawing(
        ctx,
        TEXTSCROLL,
        textScroll,
        textScrollPositionX.current,
        TEXTSCROLL.positionY * canvasHeight.current!,
        false,
        false,
      );
      if (!isTextGameScroll.current) {
        textScrollWidth.current = ctx.measureText(textScroll).width;
        isTextGameScroll.current = true;
      }
      textScrollPositionX.current -= TEXTSCROLL.scrollSpeed;
      if (textScrollPositionX.current <= -textScrollWidth.current) {
        textScrollPositionX.current = canvasWidth.current!;
      }
    },
    [canvasWidth, canvasHeight, textScrollPositionX, isTextGameScroll],
  );

  const drawTextNextLevel = useCallback(
    (ctx: CanvasRenderingContext2D, gameLevels: React.RefObject<number>, deltaTimeCounter: React.RefObject<number>) => {
      drawing(
        ctx,
        TEXTNEXTLEVEL,
        textNextLevel,
        TEXTNEXTLEVEL.positionX * canvasWidth.current!,
        TEXTNEXTLEVEL.positionY * canvasHeight.current!,
        false,
        true,
      );
      if (deltaTimeCounter.current! >= GAME.levelTime[gameLevels.current!] + GAME.levelTextNextTime0) {
        drawing(
          ctx,
          TEXTNEXTLEVEL0,
          textNextLevel0,
          TEXTNEXTLEVEL0.positionX * canvasWidth.current!,
          TEXTNEXTLEVEL0.positionY * canvasHeight.current!,
          false,
          true,
        );
        ctx.fillText(
          textNextLevel1,
          TEXTNEXTLEVEL1.positionX * canvasWidth.current!,
          TEXTNEXTLEVEL1.positionY * canvasHeight.current!,
        );
        if (deltaTimeCounter.current! >= GAME.levelTime[gameLevels.current!] + GAME.levelTextNextTime) {
          drawing(ctx, TEXTCOMPANY, textCompany[gameLevels.current!], 0, 0, true, false);
        }
      }
    },
    [canvasWidth, canvasHeight],
  );

  const drawTextArrow = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawing(
        ctx,
        TEXTARROW,
        textArrow,
        TEXTARROW.positionX * canvasWidth.current!,
        TEXTARROW.positionY * canvasHeight.current!,
        false,
        false,
      );
    },
    [canvasWidth, canvasHeight],
  );
  return { drawTextScroll, drawTextNextLevel, drawTextArrow };
};
