import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useRef } from 'react';

import styles from 'styles/Work.module.scss';

interface WorksMetrics {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface Drops {
  x: number;
  originX: number;
  y: number;
  dx: number;
  dy: number;
}

const Work: React.FC = () => {
  const { t } = useTranslation('work');
  const works = t('works', { returnObjects: true }) as string[];
  const worksMetrics = useRef<WorksMetrics[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const isInit = useRef(true);
  const isAnimateCanvas = useRef(false);

  const deltaTime = useRef(0);
  const requestAnimationRef = useRef<number | null>(null);
  const timeValueRef = useRef(Date.now());
  const targetValueRef = useRef(1);
  const animationSpeed = 0.01;

  const canvasWidth = useRef(0);
  const canvasHeight = useRef(0);
  const drops = useRef<Drops[]>([]);
  const katakana =
    'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
  const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const alphabets = katakana + latin + nums;
  const fontSizeDropBasic = 17;
  const fontSizeDrop = useRef(fontSizeDropBasic);
  const lineHeightDrop = useRef(0);
  const lineHeightSpace = 1.1;
  const fontColorDrop = '#0f0';
  const fontFamilyDrop = 'Verdana';
  const fontSizeWorkBasic = 36;
  const fontFamilyWork = 'Verdana';
  const fontWeightWork = '300';
  const fontColorWork = 'white';
  const fontSizeWork = useRef(fontSizeWorkBasic);
  const dropOpacity = 0.1; // higher opacity shorter drop text
  const dropDelete = 0.97; // max 1, reduce number of drops

  const setFont = useCallback(
    (size: number) => {
      return 'normal' + ' ' + fontWeightWork + ' ' + size + 'px ' + fontFamilyWork;
    },
    [fontWeightWork, fontFamilyWork],
  );

  const getFontSize = useCallback(
    (works: string[], fontSize: number) => {
      const sizeBasic = canvasWidth.current < 1024 ? fontSize * 0.8 : canvasWidth.current > 1300 ? fontSize * 1.1 : fontSize;
      let minFont = sizeBasic;
      ctx.current!.font = setFont(fontSizeWorkBasic);
      const fontSet = new Set<number>();
      works.map((work) => {
        let size = sizeBasic;
        while (ctx.current!.measureText(work).width > canvasWidth.current! * 0.9) {
          size = size * 0.95;
          ctx.current!.font = setFont(size);
        }
        fontSet.add(size);
      });
      Array.from(fontSet).forEach((item) => {
        if (item < minFont) minFont = item;
      });
      return minFont;
    },
    [ctx, fontSizeWorkBasic, canvasWidth, works],
  );

  const initCanvas = useCallback(() => {
    if (canvasRef.current) {
      if (!isInit.current) {
        drops.current = [];
        worksMetrics.current = [];
      }
      const canvas = canvasRef.current!;
      ctx.current = canvas.getContext('2d')!;
      const parent = canvas.parentNode;
      const parentStyles = getComputedStyle(parent as Element);
      const width = parseInt(parentStyles.getPropertyValue('width'), 10);
      const height = parseInt(parentStyles.getPropertyValue('height'), 10);
      canvasWidth.current = width;
      canvasHeight.current = height;
      canvas.width = width;
      canvas.height = height;

      fontSizeWork.current = getFontSize(works, fontSizeWorkBasic);
      fontSizeDrop.current = fontSizeWork.current / 2;
      ctx.current.font = `${fontSizeDrop.current}px ${fontFamilyDrop}`;
      lineHeightDrop.current = ctx.current.measureText('M').width * lineHeightSpace;

      const columns = canvas.width / fontSizeDrop.current;
      for (let i = 0; i < columns; i++) {
        const newDrop = {
          x: (i + 1) * fontSizeDrop.current,
          originX: (i + 1) * fontSizeDrop.current,
          y: canvasHeight.current * 1.3,
          dx: 0,
          dy: lineHeightDrop.current,
        };
        drops.current.push(newDrop);
      }

      works.map(() => {
        const newWorksMetric = {
          x1: 0,
          x2: 0,
          y1: 0,
          y2: 0,
        };
        worksMetrics.current.push(newWorksMetric);
      });

      ctx.current.textAlign = 'center';
      ctx.current.fillStyle = fontColorWork;
      ctx.current!.font = setFont(fontSizeWork.current);

      const lineHeightWork = fontSizeWork.current * 1.5;
      const positionX = canvasWidth.current / 2;
      works.map((work, i) => {
        const positionY = canvasHeight.current / 2 - ((works.length - 1) * lineHeightWork) / 2 + i * lineHeightWork;
        ctx.current!.fillText(work, positionX, positionY);
        const textMetrics = ctx.current!.measureText(work);
        worksMetrics.current[i].x1 = positionX - textMetrics.actualBoundingBoxLeft;
        worksMetrics.current[i].x2 = positionX + textMetrics.actualBoundingBoxRight;
        worksMetrics.current[i].y1 = positionY - textMetrics.actualBoundingBoxAscent;
        worksMetrics.current[i].y2 = positionY + textMetrics.actualBoundingBoxDescent;
      });
      isAnimateCanvas.current = true;
    }
  }, [
    isInit,
    canvasRef,
    fontSizeDrop,
    works,
    lineHeightSpace,
    fontFamilyDrop,
    fontColorWork,
    fontSizeWorkBasic,
    fontSizeWork,
    canvasWidth,
    canvasHeight,
    getFontSize,
    setFont,
  ]);

  const drawDrop = useCallback(() => {
    if (ctx.current) {
      ctx.current.fillStyle = `rgba(0, 0, 0, ${dropOpacity})`;
      ctx.current.fillRect(0, 0, canvasWidth.current, canvasHeight.current);
      ctx.current.fillStyle = fontColorDrop;
      ctx.current.font = `${fontSizeDrop.current}px ${fontFamilyDrop}`;
      for (let i = 0; i < drops.current.length; i++) {
        const text = alphabets[Math.floor(Math.random() * alphabets.length)];
        ctx.current.fillText(text, drops.current[i].x, drops.current[i].y);
        drops.current[i].x += drops.current[i].dx;
        drops.current[i].y += drops.current[i].dy;
        drops.current[i].dx = 0;
        worksMetrics.current.forEach((work) => {
          if (
            drops.current[i].x > work.x1 &&
            drops.current[i].x < work.x2 &&
            drops.current[i].y > work.y1 &&
            drops.current[i].y < work.y2
          ) {
            drops.current[i].y = work.y1;
            if (drops.current[i].x < canvasWidth.current / 2) {
              drops.current[i].dx = -fontSizeDrop.current;
            } else drops.current[i].dx = fontSizeDrop.current;
          }
        });

        if (drops.current[i].y > canvasHeight.current && Math.random() > dropDelete) {
          drops.current[i].y = 0;
          drops.current[i].x = drops.current[i].originX;
        }
      }
    }
  }, [
    ctx,
    canvasWidth,
    canvasHeight,
    fontSizeDrop,
    fontColorDrop,
    fontFamilyDrop,
    drops,
    alphabets,
    lineHeightDrop,
    dropOpacity,
    dropDelete,
  ]);

  const drawWork = useCallback(() => {
    if (ctx.current) {
      ctx.current.textAlign = 'center';
      ctx.current.fillStyle = fontColorWork;
      ctx.current!.font = setFont(fontSizeWork.current);
      const lineHeightWork = fontSizeWork.current * 1.5;
      const positionX = canvasWidth.current / 2;
      works.map((work, i) => {
        const positionY = canvasHeight.current / 2 - ((works.length - 1) * lineHeightWork) / 2 + i * lineHeightWork;
        ctx.current!.fillText(work, positionX, positionY);
      });
    }
  }, [ctx, fontColorWork, fontSizeWork, works, canvasWidth, canvasHeight]);

  const animateGame = useCallback(() => {
    if (isAnimateCanvas.current && ctx) {
      deltaTime.current = Date.now() - timeValueRef.current;

      const nextValue = deltaTime.current * animationSpeed;
      if (nextValue > targetValueRef.current) {
        targetValueRef.current += 1;
        drawDrop();
        drawWork();
      }
      requestAnimationRef.current = requestAnimationFrame(animateGame);
    }
  }, [isAnimateCanvas, ctx, timeValueRef, animationSpeed, drawDrop, drawWork]);

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
  }, [canvasRef, isInit, initCanvas]);

  useEffect(() => {
    if (isAnimateCanvas.current) {
      timeValueRef.current = Date.now();
      requestAnimationRef.current = requestAnimationFrame(animateGame);
    }
    return () => {
      cancelAnimationFrame(requestAnimationRef.current!);
    };
  }, [isAnimateCanvas, animateGame]);

  return (
    <div className={styles.canvasWork} id="canvasWork">
      <canvas ref={canvasRef} />;
    </div>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['navbar', 'footer', 'work'])),
    },
  };
}

export default Work;
