export const contactFormInitialState = {
  name: '',
  email: '',
  phone: '',
  position: '',
  intro: '',
};

export type ContactFormState = typeof contactFormInitialState;
type Action = Partial<ContactFormState>;

export const contactReducer = (s: ContactFormState, a: Action) => ({ ...s, ...a });
