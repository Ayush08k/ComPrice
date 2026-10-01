import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, ExternalLink, HelpCircle } from 'lucide-react';
import { getCheapestPlatformDetails, formatCurrency } from '../utils/priceEngine.js';

export default function ComPriceAI({ activeProduct, currency, onOpenGuide }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am ComPrice AI. I analyze real-time prices across Amazon, Flipkart, Croma, Reliance Digital & Apple Store. Ask me anything or click a quick shortcut below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const PRESET_PROMPTS = [
    `Where is ${activeProduct?.name?.split(' ')[1] || 'this phone'} cheapest?`,
    'Show top mobile deals under ₹60,000',
    'How can I train this AI model?'
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate AI response
    setTimeout(() => {
      let aiText = '';
      let storeLink = null;

      const lower = query.toLowerCase();

      if (lower.includes('train') || lower.includes('build') || lower.includes('how')) {
        aiText = `To train your own price comparison AI: 1) Build a Playwright web scraper for Amazon & Flipkart. 2) Use Google Gemini API for real analysis. 3) Fine-tune Llama 3/Gemini on price scenario JSONL logs. The backend is already set up at /backend — just add your GEMINI_API_KEY!`;
      } else if (activeProduct && activeProduct.platformPrices?.length > 0) {
        // Use live AI summary from backend, or derive from live prices
        const cheapest = getCheapestPlatformDetails(activeProduct);
        const aiSummary = activeProduct.aiSummary;
        if (aiSummary?.summary) {
          aiText = `🤖 ${aiSummary.aiPowered ? 'Gemini AI' : 'AI'} Recommendation: ${aiSummary.summary} Deal Score: ${aiSummary.dealScore}/10.`;
        } else if (cheapest) {
          aiText = `📊 Best deal: ${cheapest.platform.name} at ${formatCurrency(cheapest.price, currency)}, saving you ${formatCurrency(cheapest.savingsAmount, currency)} vs highest price. ${cheapest.discountPercent > 10 ? '✅ Good time to buy!' : '⏳ Wait for a bigger sale.'}`;
        } else {
          aiText = `Search for a product above and I'll fetch live prices and give you a real AI deal analysis!`;
        }
        storeLink = activeProduct.platformPrices[0]?.directLink;
      } else {
        aiText = `Search for any product above — I'll fetch live prices from Amazon, Flipkart, Croma, and Reliance Digital and give you an AI-powered deal recommendation!`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiText,
          storeLink,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 150,
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}
        >
          <Bot size={22} />
          <span>Ask ComPrice AI</span>
          <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.2)', fontSize: '0.68rem', padding: '2px 6px' }}>LIVE</span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="glass-card" style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '380px',
          height: '520px',
          zIndex: 160,
          background: '#0f172a',
          border: '1px solid #06b6d4',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)'
        }}>
          {/* Drawer Header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-color)',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopLeftRadius: 'var(--radius-lg)',
            borderTopRightRadius: 'var(--radius-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot color="#fff" size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff' }}>ComPrice AI Assistant</h4>
                <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>● Real-time Deal Engine Active</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button onClick={onOpenGuide} title="AI Architecture Guide" style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '4px' }}>
                <HelpCircle size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div style={{ flexGrow: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' : 'rgba(255, 255, 255, 0.06)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  lineHeight: 1.45,
                  border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none'
                }}
              >
                {msg.text}
                {msg.storeLink && (
                  <a
                    href={msg.storeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                    style={{ marginTop: '8px', width: '100%', textDecoration: 'none', fontSize: '0.78rem' }}
                  >
                    <span>Go to Store</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px', textAlign: 'right' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}
          </div>

          {/* Prompt Shortcuts */}
          <div style={{ padding: '8px 12px', display: 'flex', gap: '6px', overflowX: 'auto', borderTop: '1px solid var(--border-color)' }}>
            {PRESET_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                style={{
                  padding: '4px 10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Ask ComPrice AI..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flexGrow: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            <button onClick={() => handleSend()} className="btn btn-primary btn-sm" style={{ padding: '8px 12px', background: '#06b6d4' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
