/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, ThemeMode, PainterStyleID, PainterStyle, LogEntry, WowEffect, ModificationRule, NoteItem, AgentStep } from '../types';
import { PAINTER_STYLES, INITIAL_RULES } from '../constants';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  currentStyleId: PainterStyleID;
  setCurrentStyleId: (id: PainterStyleID) => void;
  currentStyle: PainterStyle;
  
  // Logic Chain
  rules: ModificationRule[];
  setRules: (rules: ModificationRule[]) => void;
  
  // Notes
  notes: NoteItem[];
  setNotes: (notes: NoteItem[]) => void;
  addNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  // Agent Chain
  agents: AgentStep[];
  setAgents: (agents: AgentStep[]) => void;
  
  // Effects
  triggerEffect: (effect: WowEffect) => void;
  activeEffect: WowEffect | null;
  
  // Logs
  logs: LogEntry[];
  addLog: (level: LogEntry['level'], message: string, details?: string) => void;
  clearLogs: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('mdmds_lang') as Language) || Language.ZH;
  });
  
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('mdmds_theme') as ThemeMode) || ThemeMode.LIGHT;
  });
  
  const [currentStyleId, setCurrentStyleId] = useState<PainterStyleID>(() => {
    return (localStorage.getItem('mdmds_style') as PainterStyleID) || 'modern_minimal';
  });
  
  const [rules, setRules] = useState<ModificationRule[]>(() => {
    const saved = localStorage.getItem('mdmds_rules');
    return saved ? JSON.parse(saved) : INITIAL_RULES;
  });
  
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [agents, setAgents] = useState<AgentStep[]>([
    { id: '1', name: 'Regulatory Auditor', model: 'gemini-3-flash-preview', prompt: 'Audit this document for TFDA compliance...', maxTokens: 2000, status: 'idle' },
    { id: '2', name: 'Technical Writer', model: 'gemini-3-flash-preview', prompt: 'Rewrite the technical spec safely...', maxTokens: 2000, status: 'idle' },
  ]);
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeEffect, setActiveEffect] = useState<WowEffect | null>(null);

  useEffect(() => localStorage.setItem('mdmds_lang', language), [language]);
  useEffect(() => localStorage.setItem('mdmds_theme', themeMode), [themeMode]);
  useEffect(() => localStorage.setItem('mdmds_style', currentStyleId), [currentStyleId]);
  useEffect(() => localStorage.setItem('mdmds_rules', JSON.stringify(rules)), [rules]);

  const currentStyle = PAINTER_STYLES.find(s => s.id === currentStyleId) || PAINTER_STYLES[0];

  const addLog = useCallback((level: LogEntry['level'], message: string, details?: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      level,
      message,
      details,
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);

  const clearLogs = () => setLogs([]);

  const triggerEffect = useCallback((effect: WowEffect) => {
    setActiveEffect(effect);
    setTimeout(() => setActiveEffect(null), 3000);
  }, []);

  const addNote = useCallback((noteData: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newNote: NoteItem = {
      ...noteData,
      id: Math.random().toString(36).substring(7),
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  const value: AppContextType = {
    language, setLanguage,
    themeMode, setThemeMode,
    currentStyleId, setCurrentStyleId, currentStyle,
    rules, setRules,
    notes, setNotes, addNote,
    agents, setAgents,
    triggerEffect, activeEffect,
    logs, addLog, clearLogs
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
