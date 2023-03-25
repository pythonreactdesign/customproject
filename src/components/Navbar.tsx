import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

import styles from 'styles/Navbar.module.scss';
import { URLS } from 'utils/urls';

interface ActiveLinkProps {
  children: ReactNode;
  href: string;
}

const ActiveLink = ({ children, href }: ActiveLinkProps) => {
  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { t } = useTranslation('navbar');

  return (
    <nav className={styles.navbar} id="menu">
      <ul>
        <li>
          <ActiveLink href={URLS.root}>{t('home')}</ActiveLink>
        </li>
        <li>
          <ActiveLink href={URLS.about}>{t('about')}</ActiveLink>
        </li>
        <li>
          <ActiveLink href={URLS.work}>{t('work')}</ActiveLink>
        </li>
        <li>
          <ActiveLink href={URLS.contact}>{t('contact')}</ActiveLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
