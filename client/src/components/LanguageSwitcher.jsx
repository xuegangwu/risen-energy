import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'zh-HK', name: '繁中', flag: '🇭🇰' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'en', name: 'EN', flag: '🇺🇸' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-sm">
        <span>{currentLang.flag}</span>
        <span className="text-white">{currentLang.name}</span>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
              lang.code === i18n.language ? 'bg-gray-100 text-black font-medium' : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
