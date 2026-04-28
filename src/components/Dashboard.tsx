/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { language, currentStyle } = useApp();

  const readinessData = [
    { name: 'D1-D5', value: 85 },
    { name: 'D6-D10', value: 45 },
    { name: 'D11-D15', value: 20 },
    { name: 'D16-D21', value: 10 },
  ];

  const efficiencyData = [
    { time: '0s', cpu: 10, ai: 5 },
    { time: '1s', cpu: 30, ai: 20 },
    { time: '2s', cpu: 45, ai: 85 },
    { time: '3s', cpu: 60, ai: 40 },
    { time: '4s', cpu: 20, ai: 10 },
  ];

  const complexityData = [
    { name: 'Class I', count: 120 },
    { name: 'Class II', count: 450 },
    { name: 'Class III', count: 280 },
  ];

  const COLORS = [currentStyle.primary, currentStyle.accent, currentStyle.secondary, '#94a3b8'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="painter-card col-span-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <LayoutDashboard className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{language === 'en' ? 'Regulatory Dashboard' : '法規戰情室'}</h2>
            <p className="text-sm opacity-70">{language === 'en' ? 'Real-time engine analytics & document readiness' : '引擎即時分析與文件就緒度'}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-xs opacity-60 uppercase">{language === 'en' ? 'System Health' : '系統健康度'}</p>
            <p className="font-bold text-green-500 flex items-center gap-1">
              <Activity className="w-4 h-4" /> 99.9%
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-60 uppercase">{language === 'en' ? 'Secured' : '加密保護'}</p>
            <p className="font-bold text-blue-500 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> AES-256
            </p>
          </div>
        </div>
      </div>

      <div className="painter-card h-[300px]">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> {language === 'en' ? 'Document Readiness %' : '文件就緒百分比'}
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={readinessData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" stroke={currentStyle.text} fontSize={12} />
            <YAxis stroke={currentStyle.text} fontSize={12} />
            <Tooltip 
              contentStyle={{ background: currentStyle.secondary, borderColor: currentStyle.primary }}
              itemStyle={{ color: currentStyle.text }}
            />
            <Bar dataKey="value" fill={currentStyle.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="painter-card h-[300px]">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" /> {language === 'en' ? 'Engine Efficiency' : '引擎執行效能'}
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={efficiencyData}>
            <defs>
              <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentStyle.accent} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={currentStyle.accent} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <Tooltip />
            <Area type="monotone" dataKey="ai" stroke={currentStyle.accent} fillOpacity={1} fill="url(#colorAi)" />
            <Area type="monotone" dataKey="cpu" stroke={currentStyle.primary} fillOpacity={0.3} fill={currentStyle.primary} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="painter-card h-[300px]">
        <h3 className="font-bold mb-4 flex items-center gap-2">
           {language === 'en' ? 'Risk Distribution' : '風險分級分佈'}
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={complexityData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {complexityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
