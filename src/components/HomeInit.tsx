import { useTranslation } from 'next-i18next';
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';

import { useLogo } from 'hooks/UseLogo';
import styles from 'styles/Home.module.scss';

import { MobileContext } from 'contexts/MobileContext';

const HomeInit: React.FC<{
  isShownPressSpace: boolean;
  setIsShownPressSpace: Dispatch<SetStateAction<boolean>>;
}> = (props) => {
  const { t } = useTranslation('home');
  const [titles, setTitles] = useState('titleFull');
  const { isMobile } = useContext(MobileContext);
  const canvasLogo = useRef<HTMLCanvasElement | null>(null);
  const { canvasAnimate } = useLogo(canvasLogo, props.setIsShownPressSpace);

  useEffect(() => {
    const refresh = parseInt(styles.titlesRefresh);
    let x = 1;
    const timer = setInterval(() => {
      switch (x) {
        case 0: {
          setTitles('titleFull');
          break;
        }
        case 1: {
          setTitles('titleFront');
          break;
        }
        case 2: {
          setTitles('titleBack');
          break;
        }
        case 3: {
          setTitles('titleMobile');
          break;
        }
      }
      x = x === 3 ? 0 : x + 1;
    }, refresh);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    canvasAnimate();
  }, []);

  return (
    <>
      <h1 className={styles.title}>{t('title')}</h1>
      <h1 className={styles.title + ' ' + styles.blink}>{titles ? t(titles) : <br />}</h1>
      <h1 className={styles.title}>{t('titleDev')}</h1>
      <div className={styles.canvasWrapper} id="canvasWrapper">
        <canvas ref={canvasLogo} />
      </div>
      <span className={styles.space}>{props.isShownPressSpace && !isMobile && t('start')}</span>
    </>
  );
};

export default HomeInit;
