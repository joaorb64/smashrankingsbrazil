import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import pt_br from './translations/pt_br.json';
import es from './translations/es.json';
import en from './translations/en.json';
import jp from './translations/jp.json';

const resources = {
  'pt': {translation: pt_br},
  'es': {translation: es},
  'en': {translation: en},
  'ja': {translation: jp}
};

const options = {
  order: ['querystring', 'navigator'],
  lookupQuerystring: 'lng'
}

i18n.use(LanguageDetector).init({
  resources,
  fallbackLng: 'en',
  debug: true,
  detection: options,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;