/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Terminal, Trash2, Info, CheckCircle, AlertTriangle, XCircle, BrainCircuit } from 'lucide-react';

export const LiveLog: React.FC = () => {
  const { logs, clearLogs, language, currentStyle } = useApp();

  const getIcon = (level: string) => {
    switch (level) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'ai': return <BrainCircuit className="w-4 h-4 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-xs rounded-xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="flex justify-between items-center bg-white/5 px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-2 text-white/70 font-bold uppercase tracking-widest text-[10px]">
          <Terminal className="w-3 h-3" />
          {language === 'en' ? 'Live Execution Log' : '即時執行紀錄'}
        </div>
        <button 
          onClick={clearLogs}
          className="p-1 hover:bg-white/10 rounded transition-colors text-white/50"
          title="Clear logs"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {logs.length === 0 && (
          <p className="text-white/20 italic">No events recorded yet. Standby for engine output...</p>
        )}
        {logs.map((log) => (
          <div key={log.id} className="group border-l-2 border-white/5 pl-3 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-[10px]">[{log.timestamp.toLocaleTimeString()}]</span>
              {getIcon(log.level)}
              <span className="text-white/90 font-medium">{log.message}</span>
            </div>
            {log.details && (
              <div className="ml-7 mt-1 text-white/40 group-hover:text-white/60 transition-colors">
                › {log.details}
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};
