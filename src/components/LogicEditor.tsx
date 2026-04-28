/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileJson, Upload, Download, Edit3, Save, 
  Trash2, Plus, AlertCircle, CheckCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import { WowEffect } from '../types';

export const LogicEditor: React.FC = () => {
  const { rules, setRules, language, addLog, triggerEffect } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);

  const downloadLogic = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rules, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mdmds_logic_chain.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    addLog('success', 'Logic Chain Downloaded', 'The current TFDA decision matrix has been exported.');
  };

  const uploadLogic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setRules(json);
        triggerEffect(WowEffect.PARTICLES);
        addLog('success', 'Logic Chain Updated', 'New rules have been successfully uploaded and integrated.');
      } catch (err) {
        addLog('error', 'Upload Failed', 'Invalid JSON format for logic chain.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="painter-card flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
             <FileJson className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black">{language === 'en' ? 'Regulatory Logic Chain' : '法規決策鏈管理'}</h2>
            <p className="text-xs opacity-60">Modify the underlying TFDA decision matrix variables.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" /> {language === 'en' ? 'Upload' : '上傳'}
            <input type="file" className="hidden" accept=".json" onChange={uploadLogic} />
          </label>
          <button 
            onClick={downloadLogic}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> {language === 'en' ? 'Download' : '下載'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rules.map((rule) => (
          <motion.div 
            key={rule.id}
            layout
            className="painter-card p-4 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 rounded-full font-black uppercase">{rule.id}</span>
                <span className="text-xs font-bold opacity-70">
                  {Object.entries(rule.triggerQuestions).map(([k, v]) => `${k}:${v}`).join(', ')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {rule.requiredDocs.map(docId => (
                  <span key={docId} className="text-xs px-2 py-1 bg-gray-100 border rounded flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3 h-3 text-green-500" /> {docId}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => addLog('info', 'Feature Locked', 'Direct rule editing is restricted in preview mode. Please use Upload/Download.')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setRules(rules.filter(r => r.id !== rule.id))}
                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        
        <button 
          onClick={() => addLog('info', 'Matrix Expansion', 'Adding new logical nodes requires strict regulatory validation.')}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 hover:bg-gray-50 transition-all"
        >
          <Plus className="w-4 h-4" /> {language === 'en' ? 'Add Logic Node' : '新增決策節點'}
        </button>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-xs text-blue-700">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <p>Warning: Modification of the logic chain directly impacts the safety and efficacy verification of the "Interrogation Engine". Ensure all JSON variables strictly match TFDA Appendix 4 nomenclature.</p>
      </div>
    </div>
  );
};
