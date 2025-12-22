import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ko from './locales/ko.json'
import en from './locales/en.json'

// ✅ LOW #9: i18n 국제화 설정
const savedLanguage = localStorage.getItem('language') || 'ko'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
    },
    lng: savedLanguage,
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  })

export default i18n
