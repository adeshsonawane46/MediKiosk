import { Link } from 'react-router-dom';
import Icon from './Icon';

export function PriorityTag({ level, label }) {
  const cls = level === 'P1' ? 'tag-p1' : level === 'P2' ? 'tag-p2' : 'tag-p3';
  const text = label || (level === 'P1' ? 'Priority 1 · Emergency' : level === 'P2' ? 'Priority 2 · Urgent' : 'Priority 3 · Routine');
  return <span className={`tag ${cls}`}>{text}</span>;
}
export function StatusTag({ children, kind = 'neutral' }) {
  return <span className={`tag tag-${kind}`}>{children}</span>;
}
export function Steps({ items, active }) {
  return (
    <div className="steps">
      {items.map((s, i) => (
        <span key={s} className={`step-pill ${i < active ? 'done' : i === active ? 'active' : ''}`}>
          {i < active ? '✓ ' : ''}{s}
        </span>
      ))}
    </div>
  );
}
export function Progress({ value }) {
  return <div className="progress-track"><div className="progress-fill" style={{ width: value + '%' }} /></div>;
}
export const LANG_MAP = {
  'en': 'en-IN', 'english': 'en-IN', 'English': 'en-IN',
  'hi': 'hi-IN', 'hindi': 'hi-IN', 'Hindi': 'hi-IN', 'हिन्दी': 'hi-IN',
  'ta': 'ta-IN', 'tamil': 'ta-IN', 'Tamil': 'ta-IN', 'தமிழ்': 'ta-IN',
  'te': 'te-IN', 'telugu': 'te-IN', 'Telugu': 'te-IN', 'తెలుగు': 'te-IN',
  'kn': 'kn-IN', 'kannada': 'kn-IN', 'Kannada': 'kn-IN', 'ಕನ್ನಡ': 'kn-IN',
  'bn': 'bn-IN', 'bengali': 'bn-IN', 'Bengali': 'bn-IN', 'বাংলা': 'bn-IN',
  'gu': 'gu-IN', 'gujarati': 'gu-IN', 'Gujarati': 'gu-IN', 'ગુજરાતી': 'gu-IN',
  'ml': 'ml-IN', 'malayalam': 'ml-IN', 'Malayalam': 'ml-IN', 'മലയാളം': 'ml-IN',
  'pa': 'pa-IN', 'punjabi': 'pa-IN', 'Punjabi': 'pa-IN', 'ਪੰਜਾਬੀ': 'pa-IN',
  'mr': 'mr-IN', 'marathi': 'mr-IN', 'Marathi': 'mr-IN', 'मराठी': 'mr-IN'
};

export function detectLanguageFromText(text) {
  if (!text) return null;
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN';
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN';
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa-IN';
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN';
  return null;
}

let voiceListCache = [];
function getVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  if (voiceListCache.length > 0) return voiceListCache;
  voiceListCache = window.speechSynthesis.getVoices() || [];
  return voiceListCache;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  try {
    getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      voiceListCache = window.speechSynthesis.getVoices() || [];
    };
  } catch {}
}

export function speakText(t, langParam) {
  if (!t || typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    let userLang = 'English';
    let slowVoice = false;
    try {
      const raw = localStorage.getItem('medikiosk_state_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.language) userLang = parsed.language;
        if (parsed.accessibility?.slowVoice) slowVoice = true;
      }
    } catch {}

    const scriptLang = detectLanguageFromText(t);
    const chosenKey = langParam || userLang;
    const targetTag = scriptLang || LANG_MAP[chosenKey] || LANG_MAP[String(chosenKey).toLowerCase()] || 'en-IN';

    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(t);
    u.lang = targetTag;
    u.rate = slowVoice ? 0.75 : 1.0;
    u.pitch = 1.0;

    const voices = getVoices();
    if (voices && voices.length > 0) {
      const primaryCode = targetTag.split('-')[0].toLowerCase();
      let matchingVoice = voices.find(v => v.lang && (v.lang.toLowerCase() === targetTag.toLowerCase() || v.lang.toLowerCase().replace('_', '-') === targetTag.toLowerCase()));

      if (!matchingVoice) {
        matchingVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(primaryCode));
      }

      if (!matchingVoice) {
        const langKeywords = {
          'hi': ['hindi', 'हिन्दी', 'devanagari'],
          'ta': ['tamil', 'தமிழ்'],
          'te': ['telugu', 'తెలుగు'],
          'kn': ['kannada', 'ಕನ್ನಡ'],
          'bn': ['bengali', 'bangla', 'বাংলা'],
          'gu': ['gujarati', 'ગુજરાતી'],
          'pa': ['punjabi', 'gurmukhi', 'ਪੰਜਾਬੀ'],
          'ml': ['malayalam', 'മലയാളം'],
          'mr': ['marathi', 'मराठी'],
          'en': ['english', 'india', 'uk', 'us']
        };
        const keywords = langKeywords[primaryCode] || [primaryCode];
        matchingVoice = voices.find(v => {
          const vName = (v.name || '').toLowerCase();
          return keywords.some(kw => vName.includes(kw));
        });
      }

      if (matchingVoice) {
        u.voice = matchingVoice;
      }
    }

    window.speechSynthesis.speak(u);
  } catch (err) {
    console.error('speakText error:', err);
  }
}

export function VoiceBar({ text = 'Voice guidance enabled. Tap the speaker icon anytime to hear instructions aloud.' }) {
  const speak = () => {
    let currentLang = 'English';
    try {
      const raw = localStorage.getItem('medikiosk_state_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.language) currentLang = parsed.language;
      }
    } catch {}
    speakText(text, currentLang);
  };
  return (
    <div className="voice-bar">
      <span className="wave" aria-hidden><i style={{ height: 10 }} /><i style={{ height: 18 }} /><i style={{ height: 12 }} /><i style={{ height: 20 }} /></span>
      <span style={{ flex: 1 }}><span className="audio-dot" />{text}</span>
      <button className="btn btn-ghost btn-sm" onClick={speak}> Listen</button>
    </div>
  );
}

export function Kpi({ v, l, sub }) {
  return <div className="kpi"><div className="v">{v}</div><div className="l">{l}</div>{sub && <div className="small muted">{sub}</div>}</div>;
}

export function StatWidget({ v, l, sub, icon, bg = '#fff' }) {
  const iconColors = {
    clipboard: 'var(--navy)', queue: 'var(--blue-dark)', flask: 'var(--saffron)',
    check: 'var(--p3)', patients: 'var(--blue-dark)', alert: 'var(--p1)',
    clock: 'var(--saffron)', heart: 'var(--p3)', kiosk: 'var(--navy)',
    stethoscope: 'var(--blue-dark)', activity: 'var(--navy)', settings: 'var(--muted)',
    audit: 'var(--navy)', document: 'var(--blue-dark)', timeline: 'var(--p3)',
    workspace: 'var(--blue-dark)', analytics: 'var(--navy)',
  };
  const iconColor = iconColors[icon] || 'var(--navy)';
  const iconBgMap = {
    clipboard: 'rgba(23, 37, 84, 0.08)', queue: 'rgba(19, 136, 8, 0.1)', flask: 'rgba(255, 153, 51, 0.1)',
    check: 'var(--p3-bg)', patients: 'rgba(19, 136, 8, 0.1)', alert: 'var(--p1-bg)',
    clock: 'rgba(255, 153, 51, 0.1)', heart: 'var(--p3-bg)', kiosk: 'rgba(23, 37, 84, 0.08)',
    stethoscope: 'rgba(19, 136, 8, 0.1)', activity: 'rgba(23, 37, 84, 0.08)', settings: 'var(--bg-rec)',
    audit: 'rgba(23, 37, 84, 0.08)', document: 'rgba(19, 136, 8, 0.1)', timeline: 'var(--p3-bg)',
    workspace: 'rgba(19, 136, 8, 0.1)', analytics: 'rgba(23, 37, 84, 0.08)',
  };
  const iconBg = iconBgMap[icon] || 'rgba(23, 37, 84, 0.08)';
  return (
    <div className="kpi-card" style={{ background: bg, borderColor: 'var(--line)' }}>
      <div className="kpi-icon" style={{ background: iconBg, color: iconColor }}><Icon name={icon} size={22} color={iconColor} /></div>
      <div>
        <div className="stat-value" style={{ fontSize: '28px', color: 'var(--ink)' }}>{v}</div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{l}</div>
        {sub && <div className="small muted" style={{ marginTop: '2px' }}>{sub}</div>}
      </div>
    </div>
  );
}

export function Empty({ title, children, to, toLabel }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 40 }}>
      <h3>{title}</h3>
      <p className="muted">{children}</p>
      {to && <Link className="btn btn-blue" to={to}>{toLabel || 'Continue'}</Link>}
    </div>
  );
}
