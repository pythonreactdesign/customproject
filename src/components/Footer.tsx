import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import { useAudio } from 'hooks/UseAudio';
import styles from 'styles/Footer.module.scss';
import pauseIcon from 'utils/icons/pause.svg';
import playIcon from 'utils/icons/play.svg';
import stopIcon from 'utils/icons/stop.svg';

const Footer: React.FC = () => {
  const { togglePlay, togglePause, toggleStop } = useAudio();
  const { t } = useTranslation('footer');
  return (
    <footer className={styles.footer}>
      <span>{t('musicBy')}</span>
      <button type="button" onClick={togglePlay}>
        <Image src={playIcon} alt="Play icon" />
      </button>
      <button type="button" onClick={togglePause}>
        <Image src={pauseIcon} alt="Pause icon" />
      </button>
      <button type="button" onClick={toggleStop}>
        <Image src={stopIcon} alt="Stop icon" />
      </button>
    </footer>
  );
};

export default Footer;
