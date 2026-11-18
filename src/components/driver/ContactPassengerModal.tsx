import React, { useState } from 'react';
import { useDriverStore } from '../../store/useDriverStore';

export const ContactPassengerModal: React.FC = () => {
  const { contactPassengerModalOpen, setContactPassengerModalOpen, activeRequest } = useDriverStore();
  const [callActive, setCallActive] = useState(false);
  const [callSec, setCallSec] = useState(0);
  const [activeTab, setActiveTab] = useState<'call' | 'chat'>('call');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'driver' | 'passenger'; text: string; time: string }>>([
    {
      sender: 'passenger',
      text: "Hi! I'm standing right next to the VVCE main security gate under the canopy.",
      time: 'Just now'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Call timer simulation
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (callActive) {
      interval = setInterval(() => {
        setCallSec((prev) => prev + 1);
      }, 1000);
    } else {
      setCallSec(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callActive]);

  if (!contactPassengerModalOpen || !activeRequest) return null;

  const quickReplies = [
    'I have arrived at the pickup location.',
    'I am 2 minutes away.',
    'Please come to the main gate.',
    'Stuck in slight traffic, arriving shortly.'
  ];

  const handleSendChat = (text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      sender: 'driver' as const,
      text: text.trim(),
      time: 'Just now'
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Simulated passenger response after 1.5s
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'passenger',
          text: 'Got it! Looking out for your vehicle.',
          time: 'Just now'
        }
      ]);
    }, 1500);
  };

  const formatSec = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-surface sm:rounded-3xl rounded-t-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              {activeRequest.passengerName.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">{activeRequest.passengerName}</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                <span className="material-symbols-outlined text-[13px] text-amber-500 fill-1">star</span>
                <span>{activeRequest.passengerRating} Rating</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">Masked Number</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setCallActive(false);
              setContactPassengerModalOpen(false);
            }}
            className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-outline-variant/20 bg-surface-container">
          <button
            onClick={() => setActiveTab('call')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'call'
                ? 'border-primary text-primary bg-surface'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            Secure Voice Call
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'chat'
                ? 'border-primary text-primary bg-surface'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            In-App Chat
          </button>
        </div>

        {/* Body Content */}
        {activeTab === 'call' ? (
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-5 min-h-[300px]">
            {callActive ? (
              <>
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center animate-pulse">
                    <span className="material-symbols-outlined text-4xl text-emerald-600">call</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-bold text-on-surface">Call Connected</h4>
                  <p className="text-xs font-mono font-bold text-emerald-600 mt-1">{formatSec(callSec)}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Skyppy End-to-End Secure Call (Number Masked)
                  </p>
                </div>
                <button
                  onClick={() => setCallActive(false)}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">call_end</span>
                  End Call
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">phone_in_talk</span>
                </div>
                <div className="max-w-xs">
                  <h4 className="text-sm font-bold text-on-surface">Simulated Free VoIP Call</h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Connect directly to {activeRequest.passengerName} without sharing personal phone numbers.
                  </p>
                </div>
                <button
                  onClick={() => setCallActive(true)}
                  className="w-full max-w-xs py-3 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  Start Free In-App Call
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-[350px]">
            {/* Chat List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-container-lowest">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'driver' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${
                      msg.sender === 'driver'
                        ? 'bg-primary text-on-primary rounded-br-none'
                        : 'bg-surface-container-high text-on-surface rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-on-surface-variant/70 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div className="p-2 border-t border-outline-variant/10 bg-surface flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(qr)}
                  className="px-2.5 py-1 text-[11px] bg-surface-container hover:bg-surface-container-high text-on-surface rounded-full shrink-0 border border-outline-variant/30 transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div className="p-3 border-t border-outline-variant/20 bg-surface flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat(inputMsg)}
                placeholder="Type a message to passenger..."
                className="flex-1 bg-surface-container px-3.5 py-2 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => handleSendChat(inputMsg)}
                disabled={!inputMsg.trim()}
                className="w-9 h-9 rounded-xl bg-primary disabled:opacity-40 text-on-primary flex items-center justify-center shrink-0 transition-opacity"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
