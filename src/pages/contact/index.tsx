import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useReducer, useState } from 'react';

import Modal from 'components/Modal';
import { contactFormInitialState, ContactFormState, contactReducer } from 'reducers/contact.reducer';
import styles from 'styles/Contact.module.scss';
import { emailRegex } from 'utils';
import { URLS } from 'utils/urls';

const Contact: React.FC = () => {
  const { t } = useTranslation('contact');
  const [state, dispatch] = useReducer(contactReducer, contactFormInitialState);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState(t('tryAgain'));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!state.email || !state.name || !state.phone || !emailRegex.test(state.email)) {
      setModalText(t('tryAgain'));
      return setIsModalOpen(true);
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/sendMail`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(state),
      });

      if (res.ok) {
        setEmailSent(true);
      } else {
        setModalText(t('somethingWentWrong'));
        setIsModalOpen(true);
      }
    } catch (error) {
      setModalText(t('somethingWentWrong'));
      setIsModalOpen(true);
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent)
    return (
      <div className={styles.container}>
        <div className={styles.submittedContainer}>
          <Image src="/heart.svg" alt="Heart" width={0} height={0} sizes="100vw" style={{ width: '10%', height: '10%' }} />
          <div className="primary">{t('thanks')}</div>
          <Link href={URLS.root}>
            <button className="primary">{t('playAgain')}</button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.primary}>{t('congratulations')}</div>
      <Image src="/heart.svg" alt="Heart" width={0} height={0} style={{ width: '10%', height: '10%' }} priority />
      <form className={styles.form} onSubmit={onSubmit}>
        {Object.keys(contactFormInitialState)
          .slice(0, -1)
          .map((key) => (
            <div key={key}>
              <input
                placeholder={t(key) || ''}
                value={state[key as keyof ContactFormState]}
                onChange={(e) => dispatch({ [key]: e.target.value })}
              />
            </div>
          ))}
        <div>
          <textarea placeholder={t('intro') || ''} value={state.intro} onChange={(e) => dispatch({ intro: e.target.value })} />
        </div>
        <button className="primary" type="submit" disabled={isLoading}>
          {t('submit')}
        </button>
      </form>
      <Modal text={modalText as string} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['navbar', 'footer', 'contact', 'common'])),
    },
  };
}
export default Contact;
