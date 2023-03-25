import { i18n } from 'next-i18next';

import { ContactFormState } from 'reducers/contact.reducer';

export const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

export const emailTemplate = ({ name, email, phone, position, intro }: ContactFormState) =>
  `<h1>${i18n?.t('contact')}</h1>

    <p>${i18n?.t('name')}</p>
    <p>${name}</p>
    <br />

    <p>${i18n?.t('email')}</p>
    <p>${email}</p>
    <br />

    <p>${i18n?.t('phone')}</p>
    <p>${phone}</p>
    <br />

    <p>${i18n?.t('position')}</p>
    <p>${position}</p>
    <br />

    <p>${i18n?.t('intro')}</p>
    <p>${intro}</p>`;

export const uuid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

export const IS_DEV = process.env.NODE_ENV !== 'production';
