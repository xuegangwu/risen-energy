import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { packageAPI, groupAPI } from '../api';

function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex gap-1">
      <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-mono">
        {String(timeLeft.hours).padStart(2, '0')}
      </span>
      <span className="text-white/70">:</span>
      <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-mono">
        {String(timeLeft.minutes).padStart(2, '0')}
      </span>
      <span className="text-white/70">:</span>
      <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-mono">
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [storagePackages, setStoragePackages] = useState([]);
  const [solarPackages, setSolarPackages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('storage');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storageRes, solarRes, groupRes] = await Promise.all([
        packageAPI.getList({ type: 'storage', isHot: true, limit: 4 }),
        packageAPI.getList({ type: 'solar', isHot: true }),
        groupAPI.getList({ status: 'ongoing' })
      ]);
      setStoragePackages(storageRes.data.packages);
      setSolarPackages(solarRes.data.packages);
      setGroups(groupRes.data.groups.slice(0, 3));
    } catch (err) {
      console.error('加载数据失败', err);
    } finally {
      setLoading(false);
    }
  };

  const defaultEndTime = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();

  const packages = activeTab === 'storage' ? storagePackages : solarPackages;

  return (
    <div>
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            risen
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto font-light">
            {t('home.heroSubtitle')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-green-400">✓</span>
              <span className="text-white/80 text-sm">{t('packages.warranty')}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-green-400">✓</span>
              <span className="text-white/80 text-sm">{t('packages.install')}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-green-400">✓</span>
              <span className="text-white/80 text-sm">{t('packages.support')}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              to={`/packages?type=${activeTab}`}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'storage'
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-yellow-400 text-black hover:bg-yellow-500'
              }`}
            >
              {activeTab === 'storage' ? t('home.exploreStorage') : t('home.exploreSolar')}
            </Link>
            <Link
              to="/roi"
              className="border border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              {t('roi.title')}
            </Link>
            <Link
              to="/groups"
              className="border border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              {t('home.groupBuying')}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {activeTab === 'storage' ? t('home.storage') : t('home.solar')}
            </h2>
            <p className="text-white/60">
              {activeTab === 'storage' ? t('home.storageDesc') : t('home.solarDesc')}
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white/5 rounded-full p-1 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab('storage')}
                className={`px-8 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'storage' 
                    ? 'bg-white text-black' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                🔋 {t('home.storage')}
              </button>
              <button
                onClick={() => setActiveTab('solar')}
                className={`px-8 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'solar' 
                    ? 'bg-yellow-400 text-black' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                ☀️ {t('home.solar')}
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-white/60">{t('common.loading')}</div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              {activeTab === 'storage' ? t('home.noStorage') : t('home.noSolar')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {packages.map((pkg) => (
                <Link
                  key={pkg._id}
                  to={`/packages/${pkg._id}`}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className={`relative h-56 flex items-center justify-center ${
                    pkg.type === 'solar' 
                      ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30' 
                      : 'bg-gradient-to-br from-green-900/30 to-blue-900/30'
                  }`}>
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                      {pkg.type === 'solar' ? '☀️' : '🔋'}
                    </span>
                    {pkg.isHot && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        HOT
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-1 text-white group-hover:text-green-400 transition-colors">{pkg.name}</h3>
                    <p className="text-white/50 text-sm mb-3">{pkg.application}</p>
                    
                    <div className="flex gap-2 mb-4">
                      {pkg.capacity && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          pkg.type === 'solar' 
                            ? 'bg-yellow-500/20 text-yellow-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {pkg.capacity}
                        </span>
                      )}
                      {pkg.power && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          pkg.type === 'solar' 
                            ? 'bg-orange-500/20 text-orange-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {pkg.power}
                        </span>
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-white/40 text-sm line-through">
                          ¥{(pkg.basePrice / 10000).toFixed(1)}万
                        </span>
                        <span className={`font-bold text-2xl ${
                          pkg.type === 'solar' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          ¥{(pkg.basePrice / 10000).toFixed(1)}万
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to={`/packages?type=${activeTab}`} className={`inline-block font-medium hover:underline ${
              activeTab === 'storage' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {t('common.viewAll')} →
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">{t('home.scenarios')}</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🏭', title: t('home.factory') },
              { icon: '🏠', title: t('home.warehouse') },
              { icon: '🏢', title: t('home.office') },
              { icon: '🛒', title: t('home.mall') },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl text-center hover:bg-white/10 transition-all duration-300">
                <div className="text-5xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-white">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="bg-green-500 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="font-bold text-black">{t('group.ongoing')}</span>
              </div>
              {groups.map(group => (
                <Link 
                  key={group._id} 
                  to="/groups"
                  className="flex items-center gap-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 transition"
                >
                  <span className="font-medium">{group.package?.name}</span>
                  <CountdownTimer endTime={group.endTime || defaultEndTime} />
                  <span className={`font-bold ${
                    group.package?.type === 'solar' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    ¥{(group.groupPrice / 10000).toFixed(1)}万
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('home.recruitLeader')}</h2>
          <p className="text-xl text-white/60 mb-8">{t('home.leaderDesc')}</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/groups"
              className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
            >
              {t('group.joinNow')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
