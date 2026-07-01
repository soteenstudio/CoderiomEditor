import { createI18n } from 'vue-i18n';
import idId from './locales/id-id.json';
import enUs from './locales/en-us.json';

const i18n = createI18n({
  legacy: false,
  locale: 'id',
  fallbackLocale: 'en',
  messages: {
    id: idId,
    en: enUs,
  },
});

export default i18n;
