/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, Plus, Trash2, ArrowRight, UserCog, 
  Cpu, MessageSquare, CheckCircle, Loader2 
} from 'lucide-react';
import { runAgentStep } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { WowEffect } from '../types';

export const AgentChain: React.FC = () => {
  const { agents, setAgents, language, addLog, triggerEffect } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);

  const addAgent = () => {
    const newAgent = {
      id: Math.random().toString(36).substring(7),
      name: `Agent ${agents.length + 1}`,
      model: 'gemini-1.5-flash',
      prompt: 'Summarize the input...',
      maxTokens: 2000,
      status: 'idle' as const,
    };
    setAgents([...agents, newAgent]);
  };

  const removeAgent = (id: string) => {
    setAgents(agents.filter(a => a.id !== id));
  };

  const updateAgent = (id: string, updates: any) => {
    setAgents(agents.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const runChain = async () => {
    if (isRunning) return;
    setIsRunning(true);
    addLog('info', 'Starting Asynchronous Agent Chain', 'Sequentially executing multiple LLM personas.');
    triggerEffect(WowEffect.SCANLINE);

    let lastOutput = agents[0].output || '';
    
    for (let i = 0; i < agents.length; i++) {
      setCurrentStepIndex(i);
      updateAgent(agents[i].id, { status: 'running' });
      triggerEffect(WowEffect.GLITCH);

      try {
        const result = await runAgentStep(agents[i].prompt, lastOutput);
        updateAgent(agents[i].id, { status: 'completed', output: result });
        lastOutput = result;
        addLog('success', `${agents[i].name} execution complete`, `Step ${i + 1} finalized.`);
      } catch (err: any) {
        updateAgent(agents[i].id, { status: 'error' });
        addLog('error', `${agents[i].name} failed`, err.message);
        break;
      }
    }

    setIsRunning(false);
    setCurrentStepIndex(null);
    triggerEffect(WowEffect.PARTICLES);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-black/5 p-4 rounded-2xl border border-black/10">
        <div>
          <h2 className="text-2xl font-black">{language === 'en' ? 'Asynchronous Agent Chain' : '非同步 Agent 鏈'}</h2>
          <p className="text-sm opacity-60">Connect multiple LLM tasks into a smart regulatory pipeline.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={addAgent}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Step
          </button>
          <button 
            onClick={runChain}
            disabled={isRunning || agents.length === 0}
            className="painter-button flex items-center gap-2 px-6 py-2 font-bold disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} />
            {isRunning ? 'Running Chain...' : 'Execute Workflow'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 relative">
        <AnimatePresence>
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`painter-card relative ${currentStepIndex === index ? 'ring-2 ring-blue-500 ring-offset-4' : ''}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${agent.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    <UserCog className="w-6 h-6" />
                  </div>
                  <div>
                    <input 
                      value={agent.name}
                      onChange={(e) => updateAgent(agent.id, { name: e.target.value })}
                      className="font-black text-lg bg-transparent border-none outline-none focus:ring-0 w-full"
                    />
                    <div className="flex items-center gap-2 text-xs opacity-50">
                      <Cpu className="w-3 h-3" /> {agent.model}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeAgent(agent.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold opacity-50 mb-2 block">System Prompt</label>
                  <textarea 
                    value={agent.prompt}
                    onChange={(e) => updateAgent(agent.id, { prompt: e.target.value })}
                    className="w-full h-32 p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl painter-input"
                    placeholder="Enter instructions for this agent..."
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold opacity-50 mb-2 block">Agent Output</label>
                  <div className="w-full h-32 p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl overflow-y-auto relative">
                    {agent.status === 'running' && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                      </div>
                    )}
                    {agent.output ? (
                      <textarea 
                        value={agent.output}
                        onChange={(e) => updateAgent(agent.id, { output: e.target.value })}
                        className="w-full h-full bg-transparent resize-none border-none outline-none"
                      />
                    ) : (
                      <p className="opacity-30 italic">No output yet...</p>
                    )}
                  </div>
                </div>
              </div>

              {index < agents.length - 1 && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 rotate-90 text-gray-500" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {agents.length === 0 && (
         <div className="text-center py-20 opacity-30 select-none">
            <MessageSquare className="w-20 h-20 mx-auto mb-4" />
            <p className="text-xl font-bold">No agents in the chain.</p>
            <p>Add a step to begin your automated regulatory journey.</p>
         </div>
      )}
    </div>
  );
};
