import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Showcase() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/showcase');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('获取案例失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = filterType === 'all' 
    ? projects 
    : projects.filter(p => p.type === filterType);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('showcase.projects')}
          </h1>
          <p className="text-white/60 text-lg">
            {t('showcase.title')}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-center gap-3 mb-12">
          <button
            onClick={() => setFilterType('all')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              filterType === 'all'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('showcase.all')}
          </button>
          <button
            onClick={() => setFilterType('storage')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              filterType === 'storage'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🔋 {t('showcase.storage')}
          </button>
          <button
            onClick={() => setFilterType('solar')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              filterType === 'solar'
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ☀️ {t('showcase.solar')}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            暂无案例数据
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`h-56 flex items-center justify-center ${
                  project.type === 'solar' 
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-100' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}>
                  <span className="text-8xl group-hover:scale-110 transition-transform duration-300">
                    {project.image}
                  </span>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      project.type === 'solar'
                        ? 'bg-yellow-400 text-black'
                        : 'bg-black text-white'
                    }`}>
                      {project.type === 'solar' ? t('home.solar') : t('home.storage')}
                    </span>
                    <span className="text-gray-400 text-sm">📍 {project.location}</span>
                  </div>
                  
                  <h3 className="font-semibold text-xl mb-2 text-gray-900">
                    {project.name}
                  </h3>
                  <p className={`font-medium mb-3 ${
                    project.type === 'solar' ? 'text-yellow-600' : 'text-black'
                  }`}>
                    {project.capacity}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  {project.features && project.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.features.map((feature, idx) => (
                        <span key={idx} className="bg-white text-gray-600 text-xs px-3 py-1 rounded-full border border-gray-200">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProjects.length > 6 && (
          <div className="text-center mt-12">
            <button className="px-6 py-3 border border-black rounded-full font-medium hover:bg-black hover:text-white transition-all">
              查看更多案例 →
            </button>
          </div>
        )}
      </div>

      <div className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            成为合作伙伴
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            如果您对我们的解决方案感兴趣，欢迎与我们联系，共同推动绿色能源发展
          </p>
          <a
            href="mailto:info@risen.com"
            className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition"
          >
            联系我们
          </a>
        </div>
      </div>
    </div>
  );
}
