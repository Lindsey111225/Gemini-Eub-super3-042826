/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useApp } from '../context/AppContext';
import { 
  Wand2, Save, FileEdit, Eye, Hash, Type, 
  Languages, Sparkles, BookOpen, Search, Palette
} from 'lucide-react';
import { transformToMarkdown, extractKeywords, summarizeNote, translateText } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { WowEffect } from '../types';

export const NoteKeeper: React.FC = () => {
  const { language, addLog, triggerEffect, currentStyle } = useApp();
  const [content, setContent] = useState('');
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordColor, setKeywordColor] = useState('#3b82f6');

  const handleMagic = async (type: string) => {
    if (!content) return;
    setIsProcessing(true);
    addLog('ai', `Executing AI Magic: ${type}`, `Processing your regulatory draft...`);
    triggerEffect(WowEffect.SPARKLE);
    
    try {
      if (type === 'format') {
        const md = await transformToMarkdown(content);
        setContent(md);
        setView('preview');
      } else if (type === 'keywords') {
        const k = await extractKeywords(content);
        setKeywords(k);
        triggerEffect(WowEffect.RIPPLE);
      } else if (type === 'summarize') {
        const summary = await summarizeNote(content);
        setContent(prev => `${prev}\n\n### AI Executive Summary\n${summary}`);
      } else if (type === 'translate') {
        const translated = await translateText(content, language === 'en' ? 'Traditional Chinese' : 'English');
        setContent(translated);
      }
      addLog('success', `${type} completed`, `AI has successfully processed your request.`);
    } catch (err: any) {
      addLog('error', `AI Magic Failed`, err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const highlightContent = (text: string) => {
    if (!keywords.length) return text;
    let highlighted = text;
    keywords.forEach(k => {
      const regex = new RegExp(`(${k})`, 'gi');
      highlighted = highlighted.replace(regex, `<span style="background-color: ${keywordColor}33; padding: 0 4px; border-radius: 4px; font-weight: bold; border-bottom: 2px solid ${keywordColor}">${k}</span>`);
    });
    return highlighted;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
      <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
        <div className="painter-card">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-500" />
            {language === 'en' ? 'AI Magics' : 'AI 魔法管家'}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => handleMagic('format')}
              disabled={isProcessing}
              className="group flex items-center gap-3 p-3 text-sm text-left hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200 disabled:opacity-50"
            >
              <Type className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-bold">{language === 'en' ? 'AI Formatting' : '自動格式化'}</div>
                <div className="text-[10px] opacity-60">Messy text to Markdown</div>
              </div>
            </button>
            
            <button 
              onClick={() => handleMagic('keywords')}
              disabled={isProcessing}
              className="group flex items-center gap-3 p-3 text-sm text-left hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200 disabled:opacity-50"
            >
              <Hash className="w-4 h-4 text-green-500" />
              <div>
                <div className="font-bold">{language === 'en' ? 'AI Keywords' : '關鍵字分析'}</div>
                <div className="text-[10px] opacity-60">Extract key terms</div>
              </div>
            </button>

            {keywords.length > 0 && (
              <div className="px-3 pb-3">
                <div className="flex items-center justify-between mb-2">
                   <div className="text-[10px] uppercase font-bold opacity-50">Picker</div>
                   <input 
                     type="color" 
                     value={keywordColor} 
                     onChange={(e) => setKeywordColor(e.target.value)}
                     className="w-4 h-4 rounded cursor-pointer"
                   />
                </div>
                <div className="flex flex-wrap gap-1">
                  {keywords.map((k, i) => (
                    <span key={i} className="text-[10px] px-1 bg-gray-100 rounded border border-gray-200">{k}</span>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={() => handleMagic('summarize')}
              disabled={isProcessing}
              className="group flex items-center gap-3 p-3 text-sm text-left hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200 disabled:opacity-50"
            >
              <BookOpen className="w-4 h-4 text-yellow-500" />
              <div>
                <div className="font-bold">{language === 'en' ? 'Summarize' : '智慧總結'}</div>
                <div className="text-[10px] opacity-60">Generate 3 key points</div>
              </div>
            </button>

            <button 
              onClick={() => handleMagic('translate')}
              disabled={isProcessing}
              className="group flex items-center gap-3 p-3 text-sm text-left hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200 disabled:opacity-50"
            >
              <Languages className="w-4 h-4 text-orange-500" />
              <div>
                <div className="font-bold">{language === 'en' ? 'Quick Translate' : '快速翻譯'}</div>
                <div className="text-[10px] opacity-60">High-fidelity med-tech trans</div>
              </div>
            </button>
          </div>
        </div>

        <div className="painter-card">
           <h3 className="font-bold mb-4 flex items-center gap-2 border-b pb-2">
            <Sparkles className="w-4 h-4 text-blue-400" /> Prompt Lab
           </h3>
           <textarea 
             placeholder="Custom instructions for AI..."
             className="w-full text-xs p-2 rounded bg-gray-50 border border-gray-200 h-24 painter-input"
           />
           <button className="painter-button w-full mt-2 text-xs py-2 flex items-center justify-center gap-1">
             <Palette className="w-3 h-3" /> Apply Styles
           </button>
        </div>
      </div>

      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-xl border border-gray-200">
          <div className="flex gap-2">
            <button 
              onClick={() => setView('edit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${view === 'edit' ? 'bg-white shadow-sm font-bold' : 'opacity-60'}`}
            >
              <FileEdit className="w-4 h-4" /> {language === 'en' ? 'Edit Mode' : '編輯模式'}
            </button>
            <button 
              onClick={() => setView('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${view === 'preview' ? 'bg-white shadow-sm font-bold' : 'opacity-60'}`}
            >
              <Eye className="w-4 h-4" /> {language === 'en' ? 'Preview' : '預覽模式'}
            </button>
          </div>
          <button 
             onClick={() => triggerEffect(WowEffect.SCANLINE)}
             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Save className="w-4 h-4" /> {language === 'en' ? 'Save Note' : '儲存筆記'}
          </button>
        </div>

        <div className="flex-1 painter-card p-0 overflow-hidden flex flex-col relative">
          <AnimatePresence mode="wait">
            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4"
              >
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="font-bold text-blue-600 animate-pulse">Gemini 1.5 Flash is thinking...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {view === 'edit' ? (
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={language === 'en' ? "Paste your regulatory notes here..." : "在此處貼上您的法規筆記..."}
              className="flex-1 w-full p-8 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed"
            />
          ) : (
            <div className="flex-1 p-8 overflow-y-auto prose prose-blue max-w-none">
              <div 
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: highlightContent(content) }} 
                style={keywords.length > 0 ? { display: 'none' } : {}}
              />
              {!keywords.length && (
                <div className="markdown-body">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              )}
               {keywords.length > 0 && (
                <div className="markdown-body whitespace-pre-wrap font-sans" dangerouslySetInnerHTML={{ __html: highlightContent(content) }} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
