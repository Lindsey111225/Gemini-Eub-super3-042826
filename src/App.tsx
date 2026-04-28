/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Language, ThemeMode, WowEffect } from './types';
import { 
  Palette, Globe, Moon, Sun, LayoutDashboard, 
  BrainCircuit, ClipboardCheck, MessageSquare, 
  FileJson, Terminal, Menu, X, Rocket
} from 'lucide-react';
import { PainterStyles } from './components/PainterStyles';
import { Visualizer } from './components/Visualizer';
import { StyleJackpot } from './components/StyleJackpot';
import { Dashboard } from './components/Dashboard';
import { InterrogationEngine } from './components/InterrogationEngine';
import { NoteKeeper } from './components/NoteKeeper';
import { AgentChain } from './components/AgentChain';
import { LogicEditor } from './components/LogicEditor';
import { LiveLog } from './components/LiveLog';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { 
    language, setLanguage, 
    themeMode, setThemeMode, 
    activeEffect, currentStyle,
    addLog
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'engine' | 'notes' | 'agents' | 'logic'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const tabs = [
    { id: 'dashboard', labelEn: 'Dashboard', labelZh: '戰情儀表板', icon: LayoutDashboard },
    { id: 'engine', labelEn: 'Engine', labelZh: '決策引擎', icon: BrainCircuit },
    { id: 'notes', labelEn: 'AI Notes', labelZh: 'AI 筆記王', icon: ClipboardCheck },
    { id: 'agents', labelEn: 'Agent Chain', labelZh: 'Agent 鏈', icon: Rocket },
    { id: 'logic', labelEn: 'Logic Edit', labelZh: '邏輯編輯', icon: FileJson },
  ] as const;

  return (
    <div className="min-h-screen flex text-[var(--mdmds-text)] transition-colors duration-500">
      <PainterStyles />
      <Visualizer effect={activeEffect} />
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="h-screen sticky top-0 sidebar-bg border-r border-black/10 flex flex-col overflow-hidden z-40 transition-colors duration-500"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="text-xl font-black truncate">MDMDS</h1>
            <p className="text-[10px] uppercase opacity-50 tracking-tighter">Regulatory Logic Chain v3.1</p>
          </div>
        </div>

        <div className="px-6 py-4 flex gap-2">
           <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
           <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
           <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                : 'hover:bg-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{language === Language.EN ? tab.labelEn : tab.labelZh}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-4">
          <StyleJackpot />
          <div className={`painter-card p-3 flex flex-col gap-3 ${currentStyle.id === 'mondrian' ? 'accent-bg' : ''}`}>
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase opacity-50 flex items-center gap-1">
                  <Terminal className="w-3 h-3" /> System Logs
                </span>
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
             </div>
             <div className="h-40 overflow-hidden rounded-lg">
                <LiveLog />
             </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-b border-black/10 flex items-center justify-between px-8 sticky top-0 header-bg z-30 transition-colors duration-500">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-2 hover:bg-black/5 rounded-full transition-colors"
             >
               {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
             </button>
             <div className="hidden sm:block">
               <span className="title-main text-lg font-black tracking-tighter uppercase opacity-80">
                 MDMDS // {tabs.find(t => t.id === activeTab)?.[language === Language.EN ? 'labelEn' : 'labelZh']}
               </span>
             </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 mr-4 px-3 py-1 bg-black/5 rounded-full text-[10px] font-mono opacity-50">
               TFDA Appx-4 Logic v3.1
            </div>
            <button 
              onClick={() => {
                const next = language === Language.EN ? Language.ZH : Language.EN;
                setLanguage(next);
                addLog('info', `Language changed to ${next === Language.EN ? 'English' : 'Chinese'}`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-black/5 rounded-xl text-sm font-bold hover:bg-black/10 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {language === Language.EN ? 'English' : '繁體中文'}
            </button>
            
            <button 
              onClick={() => {
                const next = themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
                setThemeMode(next);
                addLog('info', `Display mode: ${next}`);
              }}
              className="p-3 bg-black/5 rounded-xl hover:bg-black/10 transition-all hover:scale-110 active:scale-95"
            >
              {themeMode === ThemeMode.LIGHT ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            </button>
          </div>
        </header>

        {/* Tab content wrapper */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto h-full"
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'engine' && <InterrogationEngine />}
              {activeTab === 'notes' && <NoteKeeper />}
              {activeTab === 'agents' && <AgentChain />}
              {activeTab === 'logic' && <LogicEditor />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {/* Mobile Toggle Overlay (Optional but nice) */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 left-6 w-14 h-14 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
