/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { WowEffect } from '../types';

interface VisualizerProps {
  effect: WowEffect | null;
}

export const Visualizer: React.FC<VisualizerProps> = ({ effect }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (effect) {
      setShow(true);
      if (effect === WowEffect.PARTICLES) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#ef4444', '#eab308']
        });
      }
      const timer = setTimeout(() => setShow(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [effect]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {effect === WowEffect.RIPPLE && (
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-blue-500 rounded-full"
            />
          )}

          {effect === WowEffect.GLITCH && (
            <motion.div
              animate={{
                x: [-2, 2, -1, 1, 0],
                opacity: [1, 0.8, 1, 0.9, 1],
                filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
              }}
              transition={{ duration: 0.2, repeat: 10 }}
              className="absolute inset-0 bg-red-500/10 backdrop-invert-[0.1]"
            />
          )}

          {effect === WowEffect.SCANLINE && (
            <motion.div
              initial={{ top: '-10%' }}
              animate={{ top: '110%' }}
              transition={{ duration: 1.5, ease: "linear" }}
              className="absolute left-0 w-full h-1 bg-gradient-to-t from-cyan-500 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.8)]"
            />
          )}

          {effect === WowEffect.DISTORTION && (
            <motion.div
              animate={{
                backdropFilter: ["blur(0px)", "blur(10px)", "blur(0px)"],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            />
          )}

          {effect === WowEffect.SPARKLE && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1.5, 0],
                    x: (Math.random() - 0.5) * 800,
                    y: (Math.random() - 0.5) * 800
                  }}
                  transition={{ duration: 1.5, delay: i * 0.05 }}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_#eab308]"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
