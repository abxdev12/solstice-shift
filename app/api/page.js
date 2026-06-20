'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Key, CheckCircle2, AlertCircle, ExternalLink, Loader2, Eye, EyeOff } from 'lucide-react';
import useAppStore from '@/app/store/useAppStore';
import { isValidApiKey } from '@/app/utils/validation';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';

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
    if (!isValidApiKey(trimmed)) {
      setStatus('error');
      return;
    }
    setApiKey(trimmed);
    setStatus('saved');
    setCountdown(2);
    setTimeout(() => {
      setStatus('idle');
      setCountdown(0);
      router.push('/play');
    }, 2000);
  };

  const handleClear = () => {
    setInputValue('');
    setApiKey('');
    setStatus('idle');
    setCountdown(0);
  };

  const hasKey = storedKey && storedKey.length > 0;
  const [isMasked, setIsMasked] = useState(hasKey);
  const displayValue = isMasked ? '••••••••••••••••••••••••••••••••' : inputValue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-8 sm:gap-10"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="rounded-xl border border-black/10 bg-white p-3 shadow-xs">
          <Key size={20} className="text-neutral-700" />
        </div>
        <div>
          <h1 className="text-lg font-bold uppercase tracking-[0.15em] sm:text-xl">
            API Settings
          </h1>
          <p className="mt-1 max-w-sm text-xs uppercase tracking-[0.12em] text-neutral-500">
            Connect your Gemini API key to power the AI opponent and commentary.
          </p>
        </div>
      </div>

      {/* Key status banner */}
      <AnimatePresence>
        {hasKey && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-green-700"
          >
            <CheckCircle2 size={14} />
            API key connected
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex flex-col gap-5">
        <div className="relative">
          <Input
            label="Gemini API Key"
            placeholder="Paste your key here"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            type={showKey ? 'text' : 'password'}
          />
          <button
            type="button"
            onClick={() => setShowKey((s) => !s)}
            className="absolute right-0 top-[calc(50%+4px)] -translate-y-1/2 text-neutral-400 transition-colors hover:text-black"
            tabIndex={-1}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-red-600 sm:text-[11px]"
            >
              <AlertCircle size={14} className="shrink-0" />
              Invalid key. Gemini keys start with &quot;AIza&quot; or &quot;AQ.&quot;
            </motion.div>
          )}

          {status === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-green-700 sm:text-[11px]"
            >
              <Loader2 size={14} className="animate-spin shrink-0" />
              Key saved! Redirecting in {countdown}s...
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={handleSave}>
            Save Key
          </Button>
          <Button variant="ghost" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>

      {/* Help */}
      <div className="border-t border-black/10 pt-5 text-xs leading-relaxed text-neutral-500 sm:pt-6">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-600">
          Getting a Gemini key
        </p>
        <ol className="ml-4 list-decimal space-y-1.5 text-xs sm:text-sm">
          <li>
            Visit{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:text-black"
            >
              Google AI Studio
              <ExternalLink size={10} />
            </a>
          </li>
          <li>Click &quot;Get API Key&quot;</li>
          <li>Copy the key and paste it above</li>
        </ol>
        <p className="mt-3 rounded-lg border border-black/10 bg-white px-3 py-2 text-[10px] leading-relaxed text-neutral-500 sm:text-[11px]">
          This app uses the <strong className="text-black">gemini-3.1-flash-lite</strong> model
          for AI commentary. A free-tier API key from Google AI Studio works perfectly.
        </p>
      </div>
    </motion.div>
  );
}
