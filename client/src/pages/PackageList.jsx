import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { packageAPI } from '../api';

export default function PackageList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(searchParams.get('type') || '');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const urlType = searchParams.get('type');
    if (urlType) setType(urlType);
  }, [searchParams]);

  useEffect(() => {
    loadPackages();
  }, [type, category, sortBy, priceRange]);

  const loadPackages = async () => {
    try {
      const params = {};
      if (type) params.type = type;
      if (category) params.category = category;
      if (sortBy === 'price_asc') params.sort = 'basePrice';
      if (sortBy === 'price_desc') params.sort = '-basePrice';
      
      const res = await packageAPI.getList(params);
      let data = res.data.packages;
      
      if (priceRange) {
        if (priceRange === '0-30') data = data.filter(p => p.basePrice < 300000);
        else if (priceRange === '30-50') data = data.filter(p => p.basePrice >= 300000 && p.basePrice < 500000);
        else if (priceRange === '50-100') data = data.filter(p => p.basePrice >= 500000 && p.basePrice < 1000000);
        else if (priceRange === '100+') data = data.filter(p => p.basePrice >= 1000000);
      }
      
      if (sortBy === 'sales') {
        data.sort(() => Math.random() - 0.5);
      }
      
      setPackages(data);
    } catch (err) {
      console.error('加载套餐失败', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType) {
      setSearchParams({ type: newType });
    } else {
      setSearchParams({});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('common.packages')}</h1>
          <p className="text-white/60 text-lg">{t('packages.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 items-center mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => handleTypeChange('')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                type === ''
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('packages.allTypes')}
            </button>
            <button
              onClick={() => handleTypeChange('storage')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                type === 'storage'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🔋 {t('home.storage')}
            </button>
            <button
              onClick={() => handleTypeChange('solar')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                type === 'solar'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ☀️ {t('home.solar')}
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="ml-auto px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          >
            <option value="default">{t('packages.default')}</option>
            <option value="price_asc">{t('packages.priceAsc')}</option>
            <option value="price_desc">{t('packages.priceDesc')}</option>
            <option value="sales">{t('packages.sales')}</option>
          </select>

          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">{t('packages.noPackages')}</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <Link
                key={pkg._id}
                to={`/packages/${pkg._id}`}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                <div className={`relative h-56 flex items-center justify-center ${
                  pkg.type === 'solar' 
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-100' 
                    : 'bg-gradient-to-br from-gray-50 to-gray-100'
                }`}>
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                    {pkg.type === 'solar' ? '☀️' : '🔋'}
                  </span>
                  {pkg.isHot && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      HOT
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium ${
                    pkg.type === 'solar' ? 'bg-yellow-400 text-black' : 'bg-black text-white'
                  }`}>
                    {pkg.type === 'solar' ? t('home.solar') : t('home.storage')}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-1 text-gray-900 group-hover:text-black">{pkg.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{pkg.application}</p>
                  
                  <div className="flex gap-2 mb-4">
                    {pkg.capacity && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        pkg.type === 'solar' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {pkg.capacity}
                      </span>
                    )}
                    {pkg.power && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        pkg.type === 'solar' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {pkg.power}
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-400 text-sm line-through">
                        ¥{(pkg.basePrice / 10000).toFixed(1)}万
                      </span>
                      <span className={`font-bold text-2xl ${
                        pkg.type === 'solar' ? 'text-yellow-600' : 'text-black'
                      }`}>
                        ¥{(pkg.basePrice / 10000).toFixed(1)}万
                      </span>
                    </div>
                    {pkg.groupPrice && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded text-white ${
                          pkg.type === 'solar' ? 'bg-yellow-500' : 'bg-black'
                        }`}>
                          {t('packages.groupPrice')}
                        </span>
                        <span className={`font-semibold ${
                          pkg.type === 'solar' ? 'text-yellow-600' : 'text-black'
                        }`}>
                          ¥{(pkg.groupPrice / 10000).toFixed(1)}万
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg) => (
              <Link
                key={pkg._id}
                to={`/packages/${pkg._id}`}
                className="bg-white rounded-xl p-4 hover:shadow-lg transition flex gap-6 border border-gray-100"
              >
                <div className={`w-40 h-40 flex items-center justify-center rounded-xl ${
                  pkg.type === 'solar' ? 'bg-yellow-50' : 'bg-gray-50'
                }`}>
                  <span className="text-5xl">{pkg.type === 'solar' ? '☀️' : '🔋'}</span>
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-xl mb-1">{pkg.name}</h3>
                    <p className="text-gray-500 mb-3">{pkg.application}</p>
                    <div className="flex gap-2">
                      {pkg.capacity && <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{pkg.capacity}</span>}
                      {pkg.power && <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{pkg.power}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm line-through">¥{(pkg.basePrice / 10000).toFixed(1)}万</div>
                    <div className={`font-bold text-3xl ${pkg.type === 'solar' ? 'text-yellow-600' : 'text-black'}`}>
                      ¥{(pkg.basePrice / 10000).toFixed(1)}万
                    </div>
                    {pkg.groupPrice && (
                      <div className={`text-sm font-semibold mt-1 ${pkg.type === 'solar' ? 'text-yellow-600' : 'text-black'}`}>
                        {t('packages.groupPrice')}: ¥{(pkg.groupPrice / 10000).toFixed(1)}万
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
