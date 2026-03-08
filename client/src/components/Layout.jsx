import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import LanguageSwitcher from './LanguageSwitcher';

export default function Layout() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold tracking-tight">⚡ risen</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/packages" className="text-sm text-gray-600 hover:text-black transition">{t('common.packages')}</Link>
              <Link to="/groups" className="text-sm text-gray-600 hover:text-black transition">{t('common.groups')}</Link>
              <Link to="/showcase" className="text-sm text-gray-600 hover:text-black transition">{t('showcase.title')}</Link>
              <Link to="/roi" className="text-sm text-gray-600 hover:text-black transition">{t('roi.title')}</Link>
              <Link to="/about" className="text-sm text-gray-600 hover:text-black transition">{t('common.about')}</Link>
            </nav>
            
            <div className="flex items-center space-x-6">
              <Link to="/cart" className="relative text-gray-600 hover:text-black transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="text-sm text-gray-600 hover:text-black transition">
                    {user?.username}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-500 hover:text-black transition"
                  >
                    {t('common.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-sm text-gray-600 hover:text-black transition"
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition"
                  >
                    {t('common.register')}
                  </Link>
                </div>
              )}
              
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <Outlet />
      </main>

      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-lg font-semibold mb-4">⚡ risen</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t('about.description')}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">{t('common.products')}</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link to="/packages?type=storage" className="hover:text-white transition">{t('home.storage')}</Link></li>
                <li><Link to="/packages?type=solar" className="hover:text-white transition">{t('home.solar')}</Link></li>
                <li><Link to="/groups" className="hover:text-white transition">{t('common.groups')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">{t('common.about')}</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link to="/about" className="hover:text-white transition">{t('common.about')}</Link></li>
                <li><Link to="/showcase" className="hover:text-white transition">{t('showcase.title')}</Link></li>
                <li><Link to="/roi" className="hover:text-white transition">{t('roi.title')}</Link></li>
                <li><a href="https://cloud.risen.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">云EMS</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">{t('about.contact')}</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>{t('cart.contactPhone')}: 400-888-8888</li>
                <li>info@risen.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}
