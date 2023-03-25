import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState, useEffect, useCallback, useRef, useContext } from 'react';

import HomeInit from 'components/HomeInit';
import { useGame } from 'hooks/game/UseGame';
import styles from 'styles/Home.module.scss';

import { MobileContext } from 'contexts/MobileContext';

const Home = () => {
  const { t } = useTranslation('home');
  const [isPressSpace, setIsPressSpace] = useState(false);
  const [isShownPressSpace, setIsShownPressSpace] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isMobile } = useContext(MobileContext);
  const { Game } = useGame(isPressSpace);

  const touchHandler = () => {
    setIsPressSpace(true);
  };

  const keyboardHandler = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      setIsPressSpace(true);
    }
  }, []);

  useEffect(() => {
    if (isShownPressSpace) {
      if (!isPressSpace) {
        if (!isMobile) {
          document.addEventListener('keydown', keyboardHandler);
        } else {
          buttonRef.current?.addEventListener('touchstart', touchHandler, false);
        }
      } else {
        return () => {
          if (!isMobile) {
            document.removeEventListener('keydown', keyboardHandler);
          } else {
            buttonRef.current?.removeEventListener('touchstart', touchHandler, false);
          }
        };
      }
    }
  }, [isShownPressSpace, isPressSpace, isMobile]);

  return (
    <div className={styles.container}>
      <Head>
        <title>OurCompany</title>
        <meta name="description" content="Our Company career site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {!isPressSpace && (
          <div>
            <HomeInit isShownPressSpace={isShownPressSpace} setIsShownPressSpace={setIsShownPressSpace} />
            {isShownPressSpace && isMobile && (
              <button type="button" ref={buttonRef} className={styles.button} onClick={touchHandler}>
                {isMobile && t('button')}
              </button>
            )}
          </div>
        )}
        <div className={isPressSpace ? styles.displayBlock : styles.displayNone}> {Game()} </div>
      </main>
    </div>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['home', 'navbar', 'footer', 'about'])),
    },
  };
}

export default Home;
