import React from 'react';
import { X, BookOpen, Cpu, Database, Code, ShieldCheck, Terminal, Sparkles } from 'lucide-react';
import { AI_TRAINING_GUIDE } from '../utils/aiEngine.js';

export default function AiTrainingGuideModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(5, 8, 15, 0.88)',
      backdropFilter: 'blur(14px)',
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '900px',
        width: '100%',
        maxHeight: '88vh',
        overflowY: 'auto',
        background: '#0d1322',
        border: '1px solid #06b6d4',
        borderRadius: 'var(--radius-lg)',
        padding: '28px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div>
            <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: '1px solid #06b6d4', marginBottom: '6px' }}>
              <BookOpen size={13} /> DEVELOPER GUIDE & ARCHITECTURE
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              How to Build & Train a Real-Time Price Comparison AI
            </h3>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
          Building a production-ready AI agent that fetches, parses, and compares live market prices in real-time requires a 4-layer architecture combining web scraping pipelines, Function Calling LLMs, and LoRA fine-tuning.
        </p>

        {/* Steps Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {AI_TRAINING_GUIDE.sections.map((section, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#38bdf8' }}>{section.step}</h4>
              </div>

              <p style={{ color: '#e2e8f0', fontSize: '0.92rem', marginBottom: '12px', fontWeight: 500 }}>
                {section.description}
              </p>

              {section.details && (
                <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {section.details.map((item, dIdx) => (
                    <li key={dIdx}>{item}</li>
                  ))}
                </ul>
              )}

              {section.codeSnippet && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '4px', fontWeight: 700 }}>
                    JSONL Fine-Tuning Sample Format
                  </div>
                  <pre style={{
                    background: '#090d16',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    color: '#34d399',
                    fontSize: '0.8rem',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {section.codeSnippet}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Footer Box */}
        <div style={{
          marginTop: '24px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <ShieldCheck color="#10b981" size={24} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.88rem', color: '#d1fae5' }}>
            <strong>Production Tip:</strong> To avoid model hallucinations on live pricing data, always pass scraped JSON prices via <strong>Function Calling context</strong> rather than relying solely on parametric LLM weights!
          </div>
        </div>
      </div>
    </div>
  );
}
