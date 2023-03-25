import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

import { emailTemplate, IS_DEV } from 'utils';

const sendMail = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const transporter = nodemailer.createTransport(
      IS_DEV
        ? {
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: await nodemailer.createTestAccount(),
          }
        : {
            host: 'smtp-relay.sendinblue.com',
            port: 587,
            secure: false,
            auth: {
              user: process.env.SMTP_EMAIL,
              pass: process.env.SMTP_PW,
            },
          },
    );

    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_EMAIL,
      subject: 'Contact',
      html: emailTemplate(req.body),
    });

    if (info.accepted) {
      res.status(200).json({ message: 'Email sent!' });
      // eslint-disable-next-line no-console
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email!' });
  }
};

export default sendMail;
