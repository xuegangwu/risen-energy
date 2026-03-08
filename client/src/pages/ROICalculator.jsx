import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ROICalculator() {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    capacity: 215,
    power: 100,
    electricityPrice: 0.8,
    peakPrice: 1.2,
    valleyPrice: 0.4,
    dailyChargeDischarge: 2,
    projectCost: 800000,
    annualOandM: 15000,
    years: 10,
    hasSolar: false,
    solarCapacity: 500,
    solarCost: 420000,
    annualSolarGen: 600000,
    electricitySaveRate: 0.8,
  });

  const [results, setResults] = useState(null);

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateROI = () => {
    const { 
      capacity, power, electricityPrice, peakPrice, valleyPrice,
      dailyChargeDischarge, projectCost, annualOandM, years,
      hasSolar, solarCapacity, solarCost, annualSolarGen, electricitySaveRate
    } = inputs;

    const dailyDischarge = capacity * dailyChargeDischarge;
    const peakHours = dailyDischarge / power;
    
    const dailySaving = dailyDischarge * (peakPrice - valleyPrice);
    const annualSaving = dailySaving * 365;
    
    const solarAnnualSaving = hasSolar ? annualSolarGen * electricityPrice * electricitySaveRate : 0;
    const totalAnnualSaving = annualSaving + solarAnnualSaving;
    
    const totalInvestment = projectCost + (hasSolar ? solarCost : 0);
    const totalOandM = annualOandM * years;
    
    const totalSaving = totalAnnualSaving * years - totalOandM;
    const netProfit = totalSaving - totalInvestment;
    const roi = (totalSaving / totalInvestment) * 100;
    const paybackPeriod = totalInvestment / totalAnnualSaving;

    const yearlyData = [];
    let cumulativeSaving = 0;
    for (let i = 1; i <= years; i++) {
      cumulativeSaving += totalAnnualSaving - annualOandM;
      yearlyData.push({
        year: i,
        saving: totalAnnualSaving - annualOandM,
        cumulative: cumulativeSaving,
        net: cumulativeSaving - totalInvestment
      });
    }

    const co2Reduction = hasSolar 
      ? (annualSolarGen / 1000) * 0.7 * 365
      : (dailyDischarge * 365 / 1000) * 0.7;

    return {
      dailyDischarge,
      peakHours,
      dailySaving,
      annualSaving,
      solarAnnualSaving,
      totalAnnualSaving,
      totalInvestment,
      totalOandM,
      totalSaving,
      netProfit,
      roi,
      paybackPeriod,
      yearlyData,
      co2Reduction: co2Reduction * years
    };
  };

  const formatNumber = (num) => {
    return num.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  };

  const resultsData = calculateROI();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-slate-900 via-energy-800 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            💡 {t('roi.title')}
          </h1>
          <p className="text-gray-300">
            {t('roi.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">⚡ {t('roi.systemConfig')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('roi.capacity')} (kWh)
                  </label>
                  <input
                    type="number"
                    value={inputs.capacity}
                    onChange={(e) => handleChange('capacity', Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-energy-500"
                  />
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={inputs.capacity}
                    onChange={(e) => handleChange('capacity', Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('roi.power')} (kW)
                  </label>
                  <input
                    type="number"
                    value={inputs.power}
                    onChange={(e) => handleChange('power', Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('roi.dailyCycles')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.dailyChargeDischarge}
                    onChange={(e) => handleChange('dailyChargeDischarge', Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">💰 {t('roi.electricityPrice')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('roi.avgPrice')} (元/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputs.electricityPrice}
                    onChange={(e) => handleChange('electricityPrice', Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('roi.peakPrice')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={inputs.peakPrice}
                      onChange={(e) => handleChange('peakPrice', Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('roi.valleyPrice')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={inputs.valleyPrice}
                      onChange={(e) => handleChange('valleyPrice', Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">🏗️ {t('roi.investment')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('roi.systemCost')} (元)
                  </label>
                  <input
                    type="number"
                    value={inputs.projectCost}
                    onChange={(e) => handleChange('projectCost', Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    预估: ¥{formatNumber(inputs.capacity * 3500)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('roi.annualOM')} (元/年)
                  </label>
                  <input
                    type="number"
                    value={inputs.annualOandM}
                    onChange={(e) => handleChange('annualOandM', Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('roi.years')}
                  </label>
                  <input
                    type="number"
                    value={inputs.years}
                    onChange={(e) => handleChange('years', Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={inputs.years}
                    onChange={(e) => handleChange('years', Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">☀️ {t('roi.solarConfig')}</h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputs.hasSolar}
                    onChange={(e) => handleChange('hasSolar', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-energy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
              
              {inputs.hasSolar && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('roi.solarCapacity')} (kWp)
                    </label>
                    <input
                      type="number"
                      value={inputs.solarCapacity}
                      onChange={(e) => handleChange('solarCapacity', Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('roi.solarCost')} (元)
                    </label>
                    <input
                      type="number"
                      value={inputs.solarCost}
                      onChange={(e) => handleChange('solarCost', Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      预估: ¥{formatNumber(inputs.solarCapacity * 4200)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('roi.annualGen')} (kWh/年)
                    </label>
                    <input
                      type="number"
                      value={inputs.annualSolarGen}
                      onChange={(e) => handleChange('annualSolarGen', Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-energy-500 to-energy-600 rounded-2xl p-6 text-white">
                <p className="text-energy-100 text-sm">{t('roi.totalInvestment')}</p>
                <p className="text-2xl font-bold mt-1">¥{formatNumber(resultsData.totalInvestment)}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <p className="text-green-100 text-sm">{t('roi.netProfit')}</p>
                <p className="text-2xl font-bold mt-1">¥{formatNumber(resultsData.netProfit)}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
                <p className="text-yellow-100 text-sm">{t('roi.roi')}</p>
                <p className="text-2xl font-bold mt-1">{resultsData.roi.toFixed(0)}%</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <p className="text-blue-100 text-sm">{t('roi.payback')}</p>
                <p className="text-2xl font-bold mt-1">{resultsData.paybackPeriod.toFixed(1)} {t('roi.years')}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">📊 {t('roi.annualBenefit')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-energy-50 rounded-xl">
                  <p className="text-gray-500 text-sm">{t('roi.storageSaving')}</p>
                  <p className="text-xl font-bold text-energy-600">¥{formatNumber(resultsData.annualSaving)}</p>
                  <p className="text-xs text-gray-400">{t('roi.perYear')}</p>
                </div>
                {inputs.hasSolar && (
                  <div className="text-center p-4 bg-yellow-50 rounded-xl">
                    <p className="text-gray-500 text-sm">{t('roi.solarSaving')}</p>
                    <p className="text-xl font-bold text-yellow-600">¥{formatNumber(resultsData.solarAnnualSaving)}</p>
                    <p className="text-xs text-gray-400">{t('roi.perYear')}</p>
                  </div>
                )}
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-gray-500 text-sm">{t('roi.totalSaving')}</p>
                  <p className="text-xl font-bold text-green-600">¥{formatNumber(resultsData.totalAnnualSaving)}</p>
                  <p className="text-xs text-gray-400">{t('roi.perYear')}</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <p className="text-gray-500 text-sm">{t('roi.omCost')}</p>
                  <p className="text-xl font-bold text-red-600">¥{formatNumber(inputs.annualOandM)}</p>
                  <p className="text-xs text-gray-400">{t('roi.perYear')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">📈 {t('roi.profitCurve')}</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {resultsData.yearlyData.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t ${
                        item.net >= 0 ? 'bg-green-500' : 'bg-red-400'
                      }`}
                      style={{ 
                        height: `${Math.min(Math.abs(item.net) / resultsData.totalInvestment * 100, 100)}%`,
                        minHeight: item.year === 1 ? '4px' : '0'
                      }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{t('roi.year')}{item.year}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">{t('roi.profit')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded"></div>
                  <span className="text-sm text-gray-600">{t('roi.loss')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">🌍 {t('roi.environmental')}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-3xl mb-2">🌳</p>
                  <p className="font-bold text-lg">{formatNumber(resultsData.co2Reduction)}</p>
                  <p className="text-sm text-gray-500">{t('roi.co2Reduction')} (kg)</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-3xl mb-2">🏭</p>
                  <p className="font-bold text-lg">{formatNumber(resultsData.co2Reduction / 1000)}</p>
                  <p className="text-sm text-gray-500">{t('roi.co2Ton')} (t)</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-3xl mb-2">🌱</p>
                  <p className="font-bold text-lg">{formatNumber(resultsData.co2Reduction / 10000)}</p>
                  <p className="text-sm text-gray-500">{t('roi.treeEquiv')} (万棵)</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-energy-500 to-primary-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">🎯 {t('roi.conclusion')}</h3>
              <p className="text-lg">
                {resultsData.paybackPeriod <= 5 ? (
                  <>✅ {t('roi.conclusion1')}</>
                ) : resultsData.paybackPeriod <= 8 ? (
                  <>👍 {t('roi.conclusion2')}</>
                ) : (
                  <>🤔 {t('roi.conclusion3')}</>
                )}
              </p>
              <p className="mt-2 opacity-90">
                {t('roi.conclusionDetail', { 
                  years: resultsData.paybackPeriod.toFixed(1),
                  profit: formatNumber(resultsData.netProfit)
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
