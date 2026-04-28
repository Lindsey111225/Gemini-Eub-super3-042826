/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const PainterStyles: React.FC = () => {
  const { currentStyle, themeMode } = useApp();

  const css = useMemo(() => {
    const isDark = themeMode === 'dark';
    const bg = isDark ? currentStyle.primary : currentStyle.background;
    const text = isDark ? currentStyle.secondary : currentStyle.text;
    const primary = currentStyle.primary;
    const secondary = currentStyle.secondary;
    const accent = currentStyle.accent;

    return `
      :root {
        --mdmds-bg: ${bg};
        --mdmds-text: ${text};
        --mdmds-primary: ${primary};
        --mdmds-secondary: ${secondary};
        --mdmds-accent: ${accent};
        --mdmds-font: ${currentStyle.fontFamily};
        --mdmds-radius: ${currentStyle.borderRadius};
        --mdmds-border: ${currentStyle.borderWidth};
        --mdmds-shadow: ${currentStyle.shadow};
        --mdmds-curve: ${currentStyle.animationCurve};
        --mondrian-blue: #1D3557;
      }

      body {
        background-color: var(--mdmds-bg);
        color: var(--mdmds-text);
        font-family: var(--mdmds-font);
        transition: all 0.5s var(--mdmds-curve);
        ${currentStyle.id === 'mondrian' ? 'border: 4px solid var(--mdmds-text);' : ''}
      }

      .painter-card {
        background: var(--mdmds-secondary);
        border: var(--mdmds-border) solid var(--mdmds-text);
        border-radius: var(--mdmds-radius);
        box-shadow: var(--mdmds-shadow);
        color: var(--mdmds-text);
        padding: 1.5rem;
        ${currentStyle.id === 'mondrian' ? 'font-weight: bold;' : ''}
      }

      .painter-card.accent-bg {
        background: var(--mdmds-accent);
      }

      .painter-button {
        background: var(--mdmds-primary);
        color: white;
        border: var(--mdmds-border) solid var(--mdmds-text);
        border-radius: var(--mdmds-radius);
        padding: 0.5rem 1rem;
        font-weight: 900;
        text-transform: uppercase;
        transition: transform 0.2s var(--mdmds-curve);
        cursor: pointer;
      }

      .sidebar-bg {
        ${currentStyle.id === 'mondrian' ? 'background: var(--mondrian-blue) !important; color: white !important;' : 'background: rgba(0,0,0,0.05);'}
      }

      .header-bg {
        ${currentStyle.id === 'mondrian' ? 'background: white !important; border-bottom: 4px solid black;' : 'background: rgba(255,255,255,0.3); backdrop-filter: blur(10px);'}
      }

      .painter-button:hover {
        transform: translate(-2px, -2px);
        box-shadow: 4px 4px 0px var(--mdmds-text);
      }

      .painter-input {
        background: white;
        border: var(--mdmds-border) solid var(--mdmds-text);
        border-radius: var(--mdmds-radius);
        padding: 0.5rem;
        color: var(--mdmds-text);
      }

      ${currentStyle.noise ? `
        body::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0.05;
          pointer-events: none;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          z-index: 9999;
        }
      ` : ''}
    `;
  }, [currentStyle, themeMode]);

  return <style>{css}</style>;
};
