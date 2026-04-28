/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { TFDA_QUESTIONS, TFDA_DOCS } from '../constants';
import { CheckCircle2, ChevronRight, ChevronLeft, FileText, Info, AlertCircle } from 'lucide-react';
import { WowEffect } from '../types';

export const InterrogationEngine: React.FC = () => {
  const { language, currentStyle, triggerEffect, addLog, rules } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [finished, setFinished] = useState(false);

  const filteredQuestions = useMemo(() => {
    return TFDA_QUESTIONS.filter(q => {
      if (!q.dependsOn) return true;
      const dependValue = answers[q.dependsOn];
      if (Array.isArray(q.dependsValue)) {
        return q.dependsValue.includes(dependValue);
      }
      return dependValue === q.dependsValue;
    });
  }, [answers]);

  const currentQ = filteredQuestions[step];

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
  };

  const next = () => {
    if (step < filteredQuestions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    addLog('info', 'Executing Rule Engine...', 'Evaluating TFDA Matrix against interrogation data.');
    triggerEffect(WowEffect.SCANLINE);
    setTimeout(() => {
      setFinished(true);
      triggerEffect(WowEffect.PARTICLES);
      addLog('success', 'Decision Finalized', 'Application requirements generated successfully.');
    }, 1500);
  };

  const results = useMemo(() => {
    if (!finished) return null;
    // Basic logic demo
    const matchedRule = rules.find(r => {
      return Object.entries(r.triggerQuestions).every(([qid, qval]) => {
        if (Array.isArray(qval)) {
          return qval.some(v => answers[qid]?.includes(v));
        }
        return answers[qid] === qval;
      });
    });

    const docs = matchedRule ? matchedRule.requiredDocs.map(id => TFDA_DOCS.find(d => d.id === id)) : TFDA_DOCS.slice(0, 3);
    const notes = matchedRule ? matchedRule.notes : ['General submission requirements apply.'];

    return { docs, notes };
  }, [finished, answers, rules]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="painter-card min-h-[400px] flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs uppercase tracking-widest opacity-50 font-bold">
                {language === 'en' ? `Step ${step + 1} of ${filteredQuestions.length}` : `步驟 ${step + 1} / ${filteredQuestions.length}`}
              </span>
              <div className="flex gap-1">
                {filteredQuestions.map((_, i) => (
                  <div key={i} className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-blue-500' : 'bg-gray-200'}`} />
                ))}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-6">
                {language === 'en' ? currentQ.textEn : currentQ.textZh}
              </h2>

              <div className="space-y-3">
                {currentQ.type === 'select' && currentQ.options?.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center ${
                      answers[currentQ.id] === opt.value 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-transparent bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <span>{language === 'en' ? opt.labelEn : opt.labelZh}</span>
                    {answers[currentQ.id] === opt.value && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                ))}

                {currentQ.type === 'boolean' && (
                  <div className="flex gap-4">
                    {[true, false].map(val => (
                      <button
                        key={val.toString()}
                        onClick={() => handleAnswer(val)}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          answers[currentQ.id] === val 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-transparent bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                         {val ? (language === 'en' ? 'Yes' : '是') : (language === 'en' ? 'No' : '否')}
                      </button>
                    ))}
                  </div>
                )}
                
                {currentQ.type === 'multi' && (
                  <div className="grid grid-cols-1 gap-2">
                    {currentQ.options?.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          const current = answers[currentQ.id] || [];
                          const next = current.includes(opt.value) 
                            ? current.filter((v: string) => v !== opt.value)
                            : [...current, opt.value];
                          handleAnswer(next);
                        }}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center ${
                          (answers[currentQ.id] || []).includes(opt.value) 
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' 
                          : 'border-transparent bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <span>{language === 'en' ? opt.labelEn : opt.labelZh}</span>
                        {(answers[currentQ.id] || []).includes(opt.value) && <CheckCircle2 className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-12 border-t pt-6">
              <button
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-300 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                style={{ color: currentStyle.text }}
              >
                <ChevronLeft className="w-4 h-4" />
                {language === 'en' ? 'Back' : '上一步'}
              </button>
              <button
                disabled={answers[currentQ.id] === undefined && currentQ.type !== 'multi'}
                onClick={next}
                className="painter-button flex items-center gap-2 px-8 py-2 font-bold"
              >
                {step === filteredQuestions.length - 1 ? (language === 'en' ? 'Finish' : '完成分析') : (language === 'en' ? 'Next' : '下一步')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="painter-card"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-green-500 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black">{language === 'en' ? 'Verification Complete' : '驗證完成'}</h2>
                <p className="opacity-70">{language === 'en' ? 'Your customized TFDA document checklist is ready.' : '您的 TFDA 客製化文件清單已產生。'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-bold text-lg border-b pb-2">
                  <FileText className="w-5 h-5" />
                  {language === 'en' ? 'Required Documents' : '應檢附文件'}
                </h4>
                {results?.docs.map(doc => (
                  <div key={doc?.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 flex items-start gap-3">
                    <div className="font-bold text-blue-600 min-w-[30px]">{doc?.id}</div>
                    <div>
                      <div className="font-bold">{language === 'en' ? doc?.nameEn : doc?.nameZh}</div>
                      <div className="text-sm opacity-70">{language === 'en' ? doc?.descriptionEn : doc?.descriptionZh}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-bold text-lg border-b pb-2">
                  <Info className="w-5 h-5" />
                  {language === 'en' ? 'Regulatory Notes' : '法規附註'}
                </h4>
                {results?.notes.map((note, i) => (
                  <div key={i} className="flex gap-3 text-sm p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
                
                <div className="mt-8">
                   <button 
                     onClick={() => { setStep(0); setFinished(false); setAnswers({}); }}
                     className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-bold"
                   >
                     {language === 'en' ? 'Start New Analysis' : '重新進行分析'}
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
