import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

import logo from 'utils/logo.png';

const About: React.FC = () => {
  const { t } = useTranslation('about');
  const textCompany1 = t('textCompany1');
  const textCompany2 = t('textCompany2');
  const textCompany3 = t('textCompany3');

  return (
    <>
      <div className="aboutContainer">
        <div className="aboutCredits">
          <div className="aboutHeadings">
            <Image src={logo} alt="Logo" loading="eager" />
            <h1 className="aboutH1">Our Company</h1>
            <h2 className="aboutH2">About Us</h2>
          </div>
          <p className="aboutP">{textCompany1}</p>
          <p className="aboutP">{textCompany2}</p>
          <p className="aboutP">{textCompany3}</p>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['navbar', 'footer', 'about'])),
    },
  };
}

export default About;
