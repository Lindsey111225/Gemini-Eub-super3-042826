/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { PAINTER_STYLES } from '../constants';
import { Dices, Sparkles } from 'lucide-react';
import { WowEffect } from '../types';

export const StyleJackpot: React.FC = () => {
  const { currentStyleId, setCurrentStyleId, triggerEffect, addLog, language } = useApp();
  const [spinning, setSpinning] = useState(false);
  const [displayStyleId, setDisplayStyleId] = useState(currentStyleId);

  const startSpin = () => {
    if (spinning) return;
    setSpinning(true);
    addLog('info', 'Activating Style Jackpot...', 'Randomizing UI aesthetics based on artistic history.');
    
    let count = 0;
    const interval = setInterval(() => {
      const randomStyle = PAINTER_STYLES[Math.floor(Math.random() * PAINTER_STYLES.length)];
      setDisplayStyleId(randomStyle.id);
      count++;
      if (count > 20) {
        clearInterval(interval);
        const finalStyle = PAINTER_STYLES[Math.floor(Math.random() * PAINTER_STYLES.length)];
        setDisplayStyleId(finalStyle.id);
        setCurrentStyleId(finalStyle.id);
        setSpinning(false);
        triggerEffect(WowEffect.SPARKLE);
        addLog('success', `Style updated to: ${finalStyle.nameEn}`, `The interface has been re-rendered in the style of ${finalStyle.nameEn}.`);
      }
    }, 100);
  };

  const currentDispStyle = PAINTER_STYLES.find(s => s.id === displayStyleId) || PAINTER_STYLES[0];

  return (
    <div className="painter-card flex flex-col items-center gap-4 min-w-[280px]">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        {language === 'en' ? 'Painter Style Jackpot' : '畫家風格大樂透'}
      </h3>
      
      <div className="relative h-24 w-full bg-black/10 rounded-xl overflow-hidden border-2 border-dashed border-gray-400 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayStyleId}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="text-2xl font-black text-center px-4"
            style={{ color: currentDispStyle.primary }}
          >
            {language === 'en' ? currentDispStyle.nameEn : currentDispStyle.nameZh}
          </motion.div>
        </AnimatePresence>
      </div>

      <button 
        onClick={startSpin}
        disabled={spinning}
        className="painter-button w-full flex items-center justify-center gap-2 font-bold py-3 disabled:opacity-50"
      >
        <Dices className={`w-5 h-5 ${spinning ? 'animate-spin' : ''}`} />
        {spinning ? (language === 'en' ? 'Spinning...' : '旋轉中...') : (language === 'en' ? 'Jackpot!' : '風格抽取')}
      </button>

      <div className="grid grid-cols-5 gap-2 mt-2">
        {PAINTER_STYLES.slice(0, 10).map(style => (
          <button
            key={style.id}
            onClick={() => setCurrentStyleId(style.id)}
            className={`w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-125 ${currentStyleId === style.id ? 'ring-2 ring-offset-2 ring-black' : ''}`}
            style={{ backgroundColor: style.primary }}
            title={style.nameEn}
          />
        ))}
      </div>
    </div>
  );
};
