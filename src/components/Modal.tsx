import { useTranslation } from 'next-i18next';
import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import styles from 'styles/Modal.module.scss';

interface Props {
  text: string;
  open: boolean;
  onClose: () => void;
}

const Modal: React.FC<Props> = ({ text, open, onClose }) => {
  const ref = useRef<Element | null>(null);
  const { t } = useTranslation('common');

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>('body');
  }, []);

  useEffect(() => {
    const main = document.getElementById('__next');
    const body = document.getElementsByTagName('body');
    if (!main) return;
    main.style.filter = open ? 'blur(5px)' : 'none';
    body[0].style.overflow = open ? 'hidden' : 'initial';
  }, [open]);

  if (!ref.current || !open) return null;

  return ReactDOM.createPortal(
    <div className={styles.Modal}>
      <div className={styles.ModalContent}>
        <p>{text}</p>
        <div>
          <button className="primary" onClick={onClose}>
            {t('ok')}
          </button>
        </div>
      </div>
    </div>,
    ref.current,
  );
};

export default Modal;
