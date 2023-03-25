import { useTranslation } from 'next-i18next';

import { TEXTAMMO, TEXTSHIELD, TEXTSCORE, TEXTTIME, TEXTLEVELS } from './gameVariables';
import type { Player } from './UsePlayer';

interface TextVariable {
  fontSize: number;
  fontFamily: string;
  color: string;
  align: string;
  positionX: number;
  positionY: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: string;
}

export const useDrawPlayerText = (
  ctx: CanvasRenderingContext2D | null,
  player: React.RefObject<Player>,
  canvasWidth: React.RefObject<number>,
  canvasHeight: React.RefObject<number>,
  gameLevels: React.RefObject<number>,
) => {
  const { t } = useTranslation('home');
  const textAmmo = t('ammo');
  const textShield = t('shield');
  const textScore = t('score');
  const textLevels = t('levels');

  const drawing = (textVariable: TextVariable, text: string, positionX: number, positionY: number) => {
    const fontSize = textVariable.fontSize * (canvasWidth.current! + canvasHeight.current!) + 'px';
    ctx!.font = fontSize + ' ' + textVariable.fontFamily;
    ctx!.fillStyle = textVariable === TEXTAMMO ? player.current!.laserColor : textVariable.color;
    ctx!.shadowOffsetX = textVariable.shadowOffsetX;
    ctx!.shadowOffsetY = textVariable.shadowOffsetY;
    ctx!.shadowColor = textVariable.shadowColor;
    ctx!.textAlign = textVariable.align as CanvasTextAlign;
    ctx!.fillText(text, positionX, positionY);
  };

  const drawAmmo = () => {
    drawing(TEXTAMMO, textAmmo + ' ' + player.current!.ammo.toString(), TEXTAMMO.positionX, TEXTAMMO.positionY);
  };

  const drawShieldStrength = () => {
    drawing(TEXTSHIELD, textShield + ' ' + player.current!.shieldStrength.toString(), TEXTSHIELD.positionX, TEXTSHIELD.positionY);
  };

  const drawLevels = () => {
    drawing(
      TEXTLEVELS,
      textLevels + ' ' + Math.floor(gameLevels.current! + 1),
      canvasWidth.current! - TEXTLEVELS.positionX * (canvasWidth.current! + canvasHeight.current!),
      TEXTLEVELS.positionY,
    );
  };

  const drawScore = () => {
    drawing(
      TEXTSCORE,
      textScore + ' ' + player.current!.score,
      canvasWidth.current! - TEXTSCORE.positionX * (canvasWidth.current! + canvasHeight.current!),
      TEXTSCORE.positionY,
    );
  };

  const drawTime = (playingTimeCounter: number) => {
    drawing(TEXTTIME, (~~(playingTimeCounter / 1000)).toString(), canvasWidth.current! * TEXTTIME.positionX, TEXTTIME.positionY);
  };

  return { drawAmmo, drawShieldStrength, drawLevels, drawScore, drawTime };
};
