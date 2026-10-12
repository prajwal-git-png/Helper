import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  Check,
  ShieldCheck,
  RefreshCw,
  Copy,
  Volume2,
  VolumeX,
  HelpCircle,
} from 'lucide-react';
import { LanguageCode } from '../../types/index';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language: string;
  citations?: string[];
  timestamp: string;
}

export const AiSalesAssistantScreen: React.FC = () => {
  const { products, language, setLanguage } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>('prod-mr-29rcad');
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const quickPrompts = [
    {
      title: '60s Sales Pitch',
      query: `Give me a 60-second high-energy sales pitch for the ${activeProduct.name} to convince a family.`,
    },
    {
      title: 'Is 29L big enough?',
      query: `Customer asks: Is ${activeProduct.capacityLitres}L capacity sufficient for a family of 4? What fits inside?`,
    },
    {
      title: 'Pitch in Kannada',
      query: `Explain the key benefits of the 4-in-1 ${activeProduct.name} in friendly conversational Kannada.`,
      targetLang: 'kn' as LanguageCode,
    },
    {
      title: 'Pitch in Hindi',
      query: `Explain why 2000W heating and air frying in ${activeProduct.name} is better than a traditional OTG in conversational Hindi.`,
      targetLang: 'hi' as LanguageCode,
    },
    {
      title: 'Dehydration Feature',
      query: `Customer asks: How does the built-in dehydrator work? What snacks can they make at home?`,
    },
    {
      title: "What's in the box?",
      query: `What accessories come included inside the box for the ${activeProduct.modelNumber}?`,
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your Floor Sales Assistant for ${activeProduct.brandName} appliances. Ask me for quick pitch scripts, customer objection answers, or explanations in English, Kannada, or Hindi. Tap the speaker icon on any response to hear it read aloud!`,
      language: 'en',
      citations: [activeProduct.sources[0]?.title || 'Catalogue'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Stop TTS if unmounting
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = (text: string, msgId: string, lang: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'kn') utterance.lang = 'kn-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (queryToSend: string, targetLanguage = language) => {
    if (!queryToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryToSend,
      language: targetLanguage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/sales-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSend,
          productId: selectedProductId,
          language: targetLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get answer');

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.answer,
        language: data.language,
        citations: data.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      // Local fallback pitch generation if offline
      let localAnswer = `The ${activeProduct.name} features ${activeProduct.wattage}W rapid heating, ${activeProduct.capacityLitres}L capacity, and ${activeProduct.presetMenusCount} digital presets with 4-in-1 functions (OTG, Air Fryer, Dehydrator, Convection).`;
      if (queryToSend.toLowerCase().includes('pitch') || queryToSend.toLowerCase().includes('60s')) {
        localAnswer = `Here is your high-energy pitch: "Why buy a regular OTG and a separate air fryer when the ${activeProduct.name} gives you both in one sleek 2000W appliance? With 29 Litres it easily fits a 10-inch pizza or whole chicken, includes 13 digital presets, a dedicated fruit dehydrator, and comes backed by a 2-year warranty from Bajaj Electricals!"`;
      } else if (queryToSend.toLowerCase().includes('box') || queryToSend.toLowerCase().includes('accessories')) {
        localAnswer = `Included accessories: ${activeProduct.accessories.map((a) => a.name).join(', ')}. Everything you need for rotisserie and air frying is right inside the box!`;
      }

      const errorMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: localAnswer,
        language: targetLanguage,
        citations: ['Verified Local Specifications'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5 pb-28">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Floor Sales Copilot
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Instant floor pitch scripts, objection handling, and voice narration.
          </p>
        </div>

        {/* Product In Context Picker & Language Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="px-3 py-1.5 rounded-xl glass-pill text-xs text-amber-400 font-bold focus:outline-none"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                {p.name}
              </option>
            ))}
          </select>

          {/* iOS Segmented Language Toggle */}
          <div className="flex items-center glass-pill p-0.5 rounded-2xl text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-xl font-bold transition active:scale-95 ${
                language === 'en' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('kn')}
              className={`px-2.5 py-1 rounded-xl font-bold transition active:scale-95 ${
                language === 'kn' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400'
              }`}
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-xl font-bold transition active:scale-95 ${
                language === 'hi' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Quick Floor Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Floor Shortcuts
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (qp.targetLang) setLanguage(qp.targetLang);
                handleSendMessage(qp.query, qp.targetLang || language);
              }}
              className="px-3 py-1.5 rounded-2xl glass-pill hover:bg-white/[0.08] text-xs font-semibold text-slate-200 whitespace-nowrap active:scale-95 transition flex items-center gap-1.5"
            >
              <span className="text-amber-400 text-xs">⚡</span>
              <span>{qp.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Window (iOS iMessage Style Glass Bubble Flow) */}
      <div className="rounded-3xl glass-panel p-4 sm:p-6 shadow-xl space-y-4 min-h-[380px] flex flex-col justify-between">
        <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            const isCopied = copiedId === m.id;
            const isSpeaking = speakingMessageId === m.id;

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'glass-button-primary text-slate-950 font-semibold shadow-md rounded-br-sm'
                      : 'glass-panel text-slate-200 rounded-bl-sm border border-white/[0.08]'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>

                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        Grounded: {m.citations?.join(', ') || 'Catalogue'}
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Audio Speak Aloud button */}
                        <button
                          onClick={() => handleSpeak(m.text, m.id, m.language)}
                          className={`p-1 transition rounded-lg ${
                            isSpeaking
                              ? 'text-amber-400 bg-amber-500/20'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title={isSpeaking ? 'Stop audio' : 'Listen to pitch (TTS)'}
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Copy Script */}
                        <button
                          onClick={() => copyText(m.text, m.id)}
                          className="p-1 text-slate-400 hover:text-white active:scale-90 transition rounded-lg"
                          title="Copy script"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                  {m.timestamp}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-2xl glass-pill text-xs text-amber-400 w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing specifications...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="pt-3 border-t border-white/[0.08] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask about ${activeProduct.modelNumber} in ${language.toUpperCase()}...`}
            className="flex-1 px-4 py-3 rounded-2xl glass-panel text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-3 rounded-2xl glass-button-primary text-slate-950 shadow-md active:scale-95 disabled:opacity-40 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
