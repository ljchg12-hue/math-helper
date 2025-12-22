import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
      title={t('settings.language')}
    >
      <Globe className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {i18n.language === 'ko' ? '한국어' : 'English'}
      </span>
    </button>
  )
}
