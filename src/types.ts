/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Language {
  EN = 'en',
  ZH = 'zh_tw',
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

export type PainterStyleID = 
  | 'modern_minimal' | 'van_gogh' | 'mondrian' | 'hokusai' | 'banksy' 
  | 'kusama' | 'monet' | 'picasso' | 'dali' | 'klimt' 
  | 'basquiat' | 'warhol' | 'kahlo' | 'davinci' | 'rembrandt'
  | 'matisse' | 'rothko' | 'pollock' | 'o_keeffe' | 'magritte';

export interface PainterStyle {
  id: PainterStyleID;
  nameEn: string;
  nameZh: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  fontFamily: string;
  borderRadius: string;
  borderWidth: string;
  shadow: string;
  animationCurve: string;
  noise?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error' | 'ai';
  message: string;
  details?: string;
}

export enum WowEffect {
  PARTICLES = 'particles',
  RIPPLE = 'ripple',
  GLITCH = 'glitch',
  SCANLINE = 'scanline',
  DISTORTION = 'distortion',
  SPARKLE = 'sparkle',
}

export interface TFDAQuestion {
  id: string;
  textEn: string;
  textZh: string;
  type: 'select' | 'boolean' | 'multi';
  options?: { value: string; labelEn: string; labelZh: string }[];
  dependsOn?: string;
  dependsValue?: string | string[];
}

export interface TFDADocument {
  id: string;
  nameEn: string;
  nameZh: string;
  descriptionEn: string;
  descriptionZh: string;
}

export interface ModificationRule {
  id: string;
  triggerQuestions: Record<string, any>;
  requiredDocs: string[];
  notes: string[];
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface AgentStep {
  id: string;
  name: string;
  model: string;
  prompt: string;
  maxTokens: number;
  output?: string;
  status: 'idle' | 'running' | 'completed' | 'error';
}
