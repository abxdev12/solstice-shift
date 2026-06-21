'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Key, CheckCircle2, AlertCircle, ExternalLink, Loader2, Eye, EyeOff, Shield, Lock, Server, Sparkles, Brain, MessageSquare, Target } from 'lucide-react';
import useAppStore from '@/app/store/useAppStore';
import { isValidApiKey } from '@/app/utils/validation';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';

const features = [
  { icon: Sparkles, title: 'Move Analysis', desc: 'Get AI-powered strategic feedback on each move.' },
  { icon: Brain, title: 'Position Evaluation', desc: 'Understand the strengths and weaknesses of any position.' },
  { icon: MessageSquare, title: 'Commentary', desc: 'Receive professional coaching-style analysis.' },
  { icon: Target, title: 'Coaching', desc: 'Learn from AI-powered comparisons of play styles.' },
];

export default function ApiPage() {
  const router = useRouter();
  const storedKey = useAppStore((s) => s.apiKey);
  const setApiKey = useAppStore((s) => s.setApiKey);
  const [inputValue, setInputValue] = useState(storedKey);
  const [status, setStatus] = useState('idle');
  const [countdown, setCountdown] = useState(0);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleSave = () => {
    const trimmed = inputValue.trim();
    if (!isValidApiKey(trimmed)) { setStatus('error'); return; }
    setApiKey(trimmed); setStatus('saved'); setCountdown(2);
    setTimeout(() => { setStatus('idle'); setCountdown(0); router.push('/play'); }, 2000);
  };

  const handleClear = () => {
    setInputValue(''); setApiKey(''); setStatus('idle'); setCountdown(0);
  };

  const hasKey = storedKey && storedKey.length > 0;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8">
      <div className="flex items-start gap-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#111] p-3 shadow-sm">
          <Key size={20} className="text-amber-500/80" />
        </div>
        <div>
          <h1 className="text-lg font-bold uppercase tracking-[0.08em] text-white sm:text-xl">AI Settings</h1>
          <p className="mt-1 max-w-sm text-xs uppercase tracking-[0.08em] text-white/40">Connect your Gemini API key to power the AI opponent and commentary.</p>
        </div>
      </div>

      <AnimatePresence>
        {hasKey && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-400/80">
            <CheckCircle2 size={14} /> API key connected
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gemini Integration */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111] p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
          <Server size={14} className="text-amber-500/60" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">Gemini Integration</h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Input label="API Key" placeholder="Paste your Gemini key" value={inputValue} onChange={(e) => { setInputValue(e.target.value); if (status === 'error') setStatus('idle'); }} type={showKey ? 'text' : 'password'} />
            <button type="button" onClick={() => setShowKey((s) => !s)} className="absolute right-0 top-[calc(50%+4px)] -translate-y-1/2 text-white/30 transition-colors hover:text-white/60" tabIndex={-1}>
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {status === 'error' && (
              <motion.div key="error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-lg bg-red-950/20 border border-red-500/20 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-red-400/80">
                <AlertCircle size={12} /> Invalid key. Starts with &quot;AIza&quot; or &quot;AQ.&quot;
              </motion.div>
            )}
            {status === 'saved' && (
              <motion.div key="saved" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-400/80">
                <Loader2 size={12} className="animate-spin" /> Redirecting in {countdown}s...
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={handleSave}>Save Key</Button>
            <Button variant="ghost" onClick={handleClear}>Clear</Button>
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111] p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
          <Sparkles size={14} className="text-amber-500/60" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">AI Features</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <motion.div key={f.title} whileHover={{ y: -2 }} className="rounded-lg border border-white/[0.06] bg-[#0a0a0a] p-3 transition-all hover:border-white/[0.12]">
              <f.icon size={14} className="mb-1.5 text-amber-500/60" />
              <h3 className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/70">{f.title}</h3>
              <p className="mt-0.5 text-[8px] leading-relaxed text-white/40">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111] p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
          <Shield size={14} className="text-emerald-500/60" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">Security</h2>
        </div>
        <div className="flex flex-wrap gap-3 text-[9px] text-white/40">
          <span className="flex items-center gap-1.5"><Lock size={10} /> Stored locally in your browser</span>
          <span className="flex items-center gap-1.5"><Shield size={10} /> Never sent to our servers</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={10} /> Encrypted in memory</span>
        </div>
      </div>

      {/* Help */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111] p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
          <ExternalLink size={14} className="text-amber-500/60" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">Getting a Key</h2>
        </div>
        <ol className="ml-4 list-decimal space-y-1.5 text-[10px] text-white/50 sm:text-[11px]">
          <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-amber-500/70 underline underline-offset-2 hover:text-amber-400">Google AI Studio <ExternalLink size={9} /></a></li>
          <li>Click &quot;Get API Key&quot;</li>
          <li>Copy the key and paste it above</li>
        </ol>
        <p className="mt-3 rounded-lg border border-amber-900/30 bg-amber-950/20 px-3 py-2 text-[9px] leading-relaxed text-amber-400/70">
          Uses <strong className="text-amber-300">gemini-3.1-flash-lite</strong>. A free-tier key works perfectly.
        </p>
      </div>
    </motion.div>
  );
}
