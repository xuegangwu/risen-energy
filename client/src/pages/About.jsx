import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('common.about')}</h1>
          <p className="text-white/60 text-lg">{t('about.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-2xl font-bold mb-6">About risen</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              risen is a one-stop service platform for industrial and commercial energy storage, built by Risen Energy. Leveraging Risen Energy's 20 years of deep experience in the new energy sector and 8 years of energy storage system integration, we provide high-quality energy storage solutions for industrial and commercial users.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our platform integrates core products including Risen Energy's iCon series commercial and industrial liquid-cooled energy storage all-in-one machines and distributed solar EPC. Through standardized package models, we make purchasing energy storage systems as simple and transparent as configuring a computer.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Choose risen, choose quality and reliability.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-80 flex items-center justify-center">
            <span className="text-8xl">☀️</span>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-2xl font-bold text-center mb-12">Risen Energy</h2>
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-semibold text-lg mb-6 text-black">Overview</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</span>
                    <span>Founded in 2002, 20+ years in new energy</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</span>
                    <span>Operations in 100+ countries and regions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</span>
                    <span>10,000+ global employees</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</span>
                    <span>Annual output exceeding 20 billion RMB</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-6 text-black">Energy Storage</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</span>
                    <span>8 years of energy storage system integration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</span>
                    <span>iCon series energy storage all-in-one</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</span>
                    <span>GW-level global storage projects</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</span>
                    <span>Strategic partnerships globally</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-2xl font-bold text-center mb-12">iCon Series</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-8 rounded-2xl hover:bg-gray-100 transition duration-300">
              <div className="text-5xl mb-4">💧</div>
              <h3 className="font-semibold mb-3 text-lg">Liquid Cooling</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advanced liquid cooling system for more uniform temperature control, extended battery life, and improved system efficiency
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl hover:bg-gray-100 transition duration-300">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="font-semibold mb-3 text-lg">SiC Technology</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                131kW/261kWh model uses silicon carbide power devices for higher conversion efficiency and lower energy consumption
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl hover:bg-gray-100 transition duration-300">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="font-semibold mb-3 text-lg">Smart EMS</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Equipped with intelligent energy management system for real-time monitoring, remote operation, and peak-valley arbitrage optimization
              </p>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-2xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="font-semibold mb-2">Standard Packages</h3>
              <p className="text-gray-600 text-sm">
                Pre-configured package options with clear specifications and transparent pricing
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="font-semibold mb-2">Group Buying</h3>
              <p className="text-gray-600 text-sm">
                Enjoy tiered pricing through group purchases to reduce procurement costs
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="font-semibold mb-2">One-Stop Service</h3>
              <p className="text-gray-600 text-sm">
                Professional support from selection consultation to installation and after-sales
              </p>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-2xl font-bold text-center mb-12">Package Components</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Battery System', icon: '🔋', desc: 'LiFePO4 Battery Pack' },
              { name: 'PCS', icon: '⚡', desc: 'Bidirectional Converter' },
              { name: 'EMS', icon: '📊', desc: 'Energy Management' },
              { name: 'Power Distribution', icon: '🔌', desc: 'Transformer, Switchgear' },
              { name: 'Solar Components', icon: '☀️', desc: 'Mounting, Combiner Box' },
            ].map((item) => (
              <div key={item.name} className="bg-gray-50 p-4 rounded-xl text-center hover:bg-gray-100 transition">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black rounded-2xl p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div>
              <div className="text-2xl mb-2">📞</div>
              <p className="text-white/60">400-888-8888</p>
            </div>
            <div>
              <div className="text-2xl mb-2">✉️</div>
              <p className="text-white/60">info@risen.com</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📍</div>
              <p className="text-white/60">Beijing, China</p>
            </div>
          </div>
          <Link
            to="/packages"
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Explore Now
          </Link>
        </div>
      </div>
    </div>
  );
}
