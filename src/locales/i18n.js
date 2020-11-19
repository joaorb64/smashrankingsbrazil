import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import moment from 'moment-timezone';

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
  fallbackLng: ['en'],
  debug: true,
  detection: options,
  interpolation: {
    escapeValue: false,
    format: function(value, format, lng) {
      if(value instanceof Date) return moment(value).format(format);
      return value;
    }
  },
});

i18n.on('languageChanged', function(lng) {
  moment.locale(lng);
});

export default i18n;