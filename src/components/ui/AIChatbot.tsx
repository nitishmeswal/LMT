'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MOCK_RESPONSES = [
  "Based on your goal of **deep focus**, I recommend trying **Adderall Focus** or **Caffeine Clarity**. Both use beta wave entrainment to enhance concentration. Would you like to start a session?",
  "For **creativity and flow**, try **LSD Microdose** or **Cannabis Chill**. These use theta waves to unlock divergent thinking. Want me to queue one up?",
  "Sounds like you need some **relaxation**! I'd suggest **Meditation Pure** for gentle mindfulness, or **Ambien Dream** for deeper sedation. What intensity level works for you?",
  "For a **spiritual journey**, our most powerful experiences are **DMT Breakthrough** and **Ayahuasca Vision**. These are intense - make sure you're in a safe, comfortable space. Ready to explore?",
  "I can see you want better **sleep**. Try **Ambien Dream** with delta wave frequencies, or our gentle **Meditation Pure** session. Shall I set up a 30-minute wind-down?",
  "Great choice! Based on your past sessions, I notice you respond well to **fractal visuals** with **theta frequencies**. Want me to create a custom session with these preferences?",
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey! I'm your AI Trip Curator 🧠✨ Tell me what you're looking for today - focus, creativity, relaxation, sleep, or something spiritual? I'll find the perfect dose for you.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)],
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiResponse]);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-neuro-purple to-neuro-magenta shadow-lg shadow-neuro-purple/30 flex items-center justify-center"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-black" />
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 right-4 z-40 w-80 sm:w-96 h-[28rem] glass rounded-2xl border border-white/20 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-neuro-purple/20 to-neuro-magenta/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neuro-purple to-neuro-magenta flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Trip Curator</h3>
                  <p className="text-xs text-white/60">Powered by GPT-4 • Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-neuro-cyan/20'
                        : 'bg-gradient-to-r from-neuro-purple to-neuro-magenta'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-neuro-cyan" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-neuro-cyan/20 text-white rounded-tr-md'
                        : 'bg-white/10 text-white/90 rounded-tl-md'
                    }`}
                  >
                    <p dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neuro-purple to-neuro-magenta flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-md">
                    <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neuro-purple/50 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-xs text-white/30 text-center mt-2">
                🔮 Mock responses • Full GPT-4 integration coming soon
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
