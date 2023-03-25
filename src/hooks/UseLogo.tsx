import { useEffect, useRef, useState, useCallback, Dispatch, SetStateAction } from 'react';

interface Pixels {
  x: number;
  y: number;
  color: string;
  originX: number;
  originY: number;
}

export const useLogo = (
  canvasLogo: React.RefObject<HTMLCanvasElement>,
  setIsShownPressSpace: Dispatch<SetStateAction<boolean>>,
) => {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const isMovingPixel = useRef(false);
  const isConverted = useRef(false);
  const isInit = useRef(true);
  const isLoaded = useRef(false);
  const image = useRef<HTMLImageElement | null>(null);
  const imageWidth = useRef(0);
  const imageHeight = useRef(0);
  const requestAnimationRef = useRef<number | null>(null);
  const targetValueRef = useRef(1);
  const timeValueRef = useRef(Date.now());
  const animationSpeed = 0.01;
  const gravitySpeed = useRef(0);
  const pixelSize = 1;
  const pixelsRef = useRef<Pixels[]>([]);
  const deltaOrigin = useRef(1);
  const deltaOriginCancelAnimation = 0.03;

  const loadImage = useCallback(() => {
    if (!isLoaded.current || isInit.current) {
      const newImage = new Image() as HTMLImageElement;
      newImage.loading = 'eager';
      newImage.src = './logo.png';
      newImage.onload = () => {
        image.current = newImage;
        imageWidth.current = newImage.width;
        imageHeight.current = newImage.height;
        isLoaded.current = true;
        setCanvasWidth(imageWidth.current);
        setCanvasHeight(imageHeight.current);
      };
    }
  }, []);

  const convertToPixels = useCallback(
    (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
      pixelsRef.current = [];
      let pixelsNumbers = 0;
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
      for (let y = 0; y < canvasHeight; y += pixelSize) {
        for (let x = 0; x < canvasWidth; x += pixelSize) {
          const index = (y * canvasWidth + x) * 4;
          const opacity = imageData[index + 3];
          if (opacity > 1) {
            const red = imageData[index];
            const green = imageData[index + 1];
            const blue = imageData[index + 2];
            const rgb = 'rgb(' + red + ',' + green + ',' + blue + ')';
            const newPixel = {
              x: Math.random() * canvasWidth,
              y: Math.random() * canvasHeight,
              color: rgb,
              originX: x,
              originY: y,
            };
            pixelsRef.current.push(newPixel);
          }
        }
      }

      pixelsNumbers = pixelsRef.current.length;
      gravitySpeed.current = (pixelsNumbers / 100000) * 0.15 + 0.1;

      ctx!.clearRect(0, 0, canvasWidth, canvasHeight);
      isConverted.current = true;
    },
    [pixelSize, canvasWidth, canvasHeight],
  );

  const canvasAnimate = () => {
    isMovingPixel.current = true;
  };

  const initCanvas = useCallback(() => {
    if (isLoaded.current && canvasLogo.current) {
      const canvas = canvasLogo.current;
      const ctx = canvas.getContext('2d')!;
      setCtx(ctx);
      canvas.style.position = 'absolute';
      const parent = canvas.parentNode;
      const parentStyles = getComputedStyle(parent as Element);
      const width = parseInt(parentStyles.getPropertyValue('width'), 10);
      const height = parseInt(parentStyles.getPropertyValue('height'), 10);
      setCanvasWidth(width);
      setCanvasHeight(height);
      canvas.width = width;
      canvas.height = height;
      setCanvas(canvas);

      const scale = Math.min(width / imageWidth.current, height / imageHeight.current);
      const x = width / 2 - (imageWidth.current / 2) * scale;
      const y = height / 2 - (imageHeight.current / 2) * scale;
      ctx.drawImage(image.current!, x, y, imageWidth.current * scale, imageHeight.current * scale);

      if (!isConverted.current) {
        convertToPixels(ctx, width, height);
      }
    }
  }, [canvasLogo, canvasWidth, canvasHeight, image.current, isLoaded, loadImage]);

  useEffect(() => {
    if (canvasLogo.current && isInit.current && isLoaded.current) {
      initCanvas();
      isInit.current = false;
    }
    window.addEventListener('resize', initCanvas);
    return () => {
      window.removeEventListener('resize', initCanvas);
    };
  }, [canvasLogo.current, isInit.current, initCanvas, isLoaded.current]);

  useEffect(() => {
    if (!isLoaded.current) {
      loadImage();
    }
  }, [isLoaded.current]);

  const updatePixels = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      pixelsRef.current.forEach((pixel) => {
        ctx.fillStyle = pixel.color;
        ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
        pixel.x += (pixel.originX - pixel.x) * gravitySpeed.current;
        pixel.y += (pixel.originY - pixel.y) * gravitySpeed.current;
        deltaOrigin.current = Math.abs(pixel.originX - pixel.x) + Math.abs(pixel.originY - pixel.y);
      });
    },
    [pixelsRef, pixelSize],
  );

  const renderFrame = useCallback(() => {
    ctx!.clearRect(0, 0, canvasWidth, canvasHeight);
    updatePixels(ctx!);
  }, [ctx, updatePixels, canvasWidth, canvasHeight]);

  const animate = useCallback(() => {
    if (!canvas) return;
    const deltaTime = Date.now() - timeValueRef.current;
    const nextValue = deltaTime * animationSpeed;

    if (deltaOrigin.current < deltaOriginCancelAnimation) {
      cancelAnimationFrame(requestAnimationRef.current!);
      requestAnimationRef.current = null;
      targetValueRef.current = 1;
      isMovingPixel.current = false;
      isConverted.current = false;
      setIsShownPressSpace(true);
      return;
    }
    if (nextValue > targetValueRef.current) {
      targetValueRef.current += 1;
      renderFrame();
    }
    requestAnimationRef.current = requestAnimationFrame(animate);
  }, [canvas, ctx, canvasHeight, canvasWidth, renderFrame]);

  useEffect(() => {
    if (isMovingPixel.current) {
      timeValueRef.current = Date.now();
      requestAnimationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(requestAnimationRef.current!);
    };
  }, [isMovingPixel.current, animate]);

  return { canvasAnimate };
};
