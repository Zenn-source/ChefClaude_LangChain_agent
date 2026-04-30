// chat.jsx — Chef Claude chat UI
import React from 'react'

const useTweaks = (defaults) => {
  const [tweaks, setTweaks] = React.useState(defaults)
  const setTweak = (key, value) => setTweaks((prev) => ({ ...prev, [key]: value }))
  return [tweaks, setTweak]
}
const TweaksPanel = ({ children }) => <div style={{ display: 'none' }}>{children}</div>
const TweakSection = () => null
const TweakRadio = () => null

const PALETTES = {
  slate: {
    name: 'Slate',
    bg: '#0a0e14',
    surface: '#0f141c',
    elevated: '#161d28',
    border: '#1f2937',
    borderSoft: '#141b25',
    text: '#e5e7eb',
    textDim: '#9ca3af',
    muted: '#6b7280',
    accent: '#3b82f6',
    accentHover: '#2563eb',
    sidebarBg: '#070a0f',
  },
  midnight: {
    name: 'Midnight',
    bg: '#070d1a',
    surface: '#0c1426',
    elevated: '#13203a',
    border: '#1e2c4a',
    borderSoft: '#0f1a30',
    text: '#e5ecf7',
    textDim: '#94a3c4',
    muted: '#5e6e8e',
    accent: '#6366f1',
    accentHover: '#4f46e5',
    sidebarBg: '#050a14',
  },
  obsidian: {
    name: 'Obsidian',
    bg: '#0a0a0a',
    surface: '#111111',
    elevated: '#1a1a1a',
    border: '#262626',
    borderSoft: '#171717',
    text: '#fafafa',
    textDim: '#a3a3a3',
    muted: '#737373',
    accent: '#fafafa',
    accentHover: '#e5e5e5',
    sidebarBg: '#050505',
  },
  espresso: {
    name: 'Espresso',
    bg: '#120e0a',
    surface: '#1a1410',
    elevated: '#241b14',
    border: '#3a2a1e',
    borderSoft: '#1f1812',
    text: '#f5ede2',
    textDim: '#b39c84',
    muted: '#8a7460',
    accent: '#e0a872',
    accentHover: '#c8915d',
    sidebarBg: '#0c0907',
  },
};

const SUGGESTIONS = [
  { title: 'What can I make with', body: 'chicken thighs, lemon, and garlic?' },
  { title: 'A 20-minute weeknight', body: 'pasta, something a bit spicy.' },
  { title: 'Substitute for buttermilk', body: 'in pancakes — what works?' },
  { title: 'Help me plan dinner', body: 'for 4, mostly vegetarian.' },
];

// ── Icons ────────────────────────────────────────────────────────────────
const IconChef = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
       strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 14h12v6a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" />
    <path d="M7 14a4 4 0 0 1-2-7.5A4 4 0 0 1 12 4a4 4 0 0 1 7 2.5A4 4 0 0 1 17 14" />
    <path d="M9 14v-3M12 14v-4M15 14v-3" />
  </svg>
);

const IconPlus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconSend = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const IconCopy = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);

const IconCheck = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12l5 5L20 6" />
  </svg>
);

const IconMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

// ── Pulsing dots ─────────────────────────────────────────────────────────
function ThinkingDots({ color }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '6px 2px', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="cc-dot"
              style={{ background: color, animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}

// ── Copy button ──────────────────────────────────────────────────────────
function CopyButton({ text, palette }) {
  const [copied, setCopied] = React.useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button onClick={onCopy} className="cc-copy"
            style={{ color: copied ? palette.accent : palette.muted }}
            aria-label={copied ? 'Copied' : 'Copy message'}>
      {copied ? <IconCheck /> : <IconCopy />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

// ── Message bubble ───────────────────────────────────────────────────────
function Bubble({ msg, palette, isLast }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`cc-row ${isUser ? 'cc-row-user' : 'cc-row-ai'}`}>
      <div className="cc-bubble-wrap">
        <div className="cc-bubble"
             style={{
               background: isUser ? palette.accent : palette.surface,
               color: isUser
                 ? (palette.name === 'Obsidian' ? '#0a0a0a' : '#ffffff')
                 : palette.text,
               border: isUser ? 'none' : `1px solid ${palette.border}`,
             }}>
          {msg.thinking
            ? <ThinkingDots color={isUser ? '#ffffff' : palette.textDim} />
            : <div className="cc-msg-text">{msg.content}</div>}
        </div>
        {!isUser && !msg.thinking && msg.content && (
          <div className="cc-meta">
            <CopyButton text={msg.content} palette={palette} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────
function EmptyState({ palette, onPick }) {
  return (
    <div className="cc-empty">
      <div className="cc-empty-mark" style={{ background: palette.elevated, color: palette.accent, borderColor: palette.border }}>
        <IconChef size={22} color={palette.accent} />
      </div>
      <h1 className="cc-empty-title" style={{ color: palette.text }}>
        What are we cooking?
      </h1>
      <p className="cc-empty-sub" style={{ color: palette.textDim }}>
        Ask for a recipe, a substitution, or a dinner plan. I'll keep it simple.
      </p>
      <div className="cc-suggest-grid">
        {SUGGESTIONS.map((s, i) => (
          <button key={i} className="cc-suggest"
                  style={{ background: palette.surface, borderColor: palette.border, color: palette.text }}
                  onClick={() => onPick(`${s.title} ${s.body}`)}>
            <span style={{ color: palette.text }}>{s.title}</span>
            <span style={{ color: palette.muted }}> {s.body}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main app ─────────────────────────────────────────────────────────────
function ChatApp() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "palette": "slate"
  }/*EDITMODE-END*/;

  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const palette = PALETTES[tweaks.palette] || PALETTES.slate;

  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const scrollRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const taRef = React.useRef(null);

  // Auto-scroll on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-grow textarea
  React.useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto';
      taRef.current.style.height = Math.min(180, taRef.current.scrollHeight) + 'px';
    }
  }, [input]);

  const send = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || busy) return;
    const userMsg = { role: "user", content: text };
    const thinkingMsg = { role: "assistant", content: "", thinking: true };
    setMessages((m) => [...m, userMsg, thinkingMsg]);
    setInput("");
    setBusy(true);

    const history = [...messages, userMsg]
      .filter((m) => !m.thinking)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      const reply = data.reply;
      setMessages((m) => {
        const next = [...m];
        // Replace last (the thinking placeholder)
        next[next.length - 1] = { role: "assistant", content: reply.trim() };
        return next;
      });
    } catch (e) {
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = {
          role: "assistant",
          content:
            "Sorry — I couldn't reach the kitchen. Try again in a moment.",
        };
        return next;
      });
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const newChat = () => {
    setMessages([]);
    setInput('');
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // CSS variables for the palette
  const cssVars = {
    '--bg': palette.bg,
    '--surface': palette.surface,
    '--elevated': palette.elevated,
    '--border': palette.border,
    '--border-soft': palette.borderSoft,
    '--text': palette.text,
    '--text-dim': palette.textDim,
    '--muted': palette.muted,
    '--accent': palette.accent,
    '--accent-hover': palette.accentHover,
    '--sidebar': palette.sidebarBg,
  };

  return (
    <div className="cc-app" style={cssVars}>
      {/* Sidebar */}
      <aside className={`cc-sidebar ${sidebarOpen ? 'cc-sidebar-open' : ''}`}>
        <div className="cc-side-top">
          <div className="cc-brand">
            <div className="cc-brand-mark">
              <IconChef size={16} color={palette.accent} />
            </div>
            <div className="cc-brand-text">
              <div className="cc-brand-name">Chef Claude</div>
              <div className="cc-brand-sub">Recipe assistant</div>
            </div>
          </div>
        </div>
        <div className="cc-side-mid">
          <button className="cc-new-chat" onClick={newChat}>
            <IconPlus />
            <span>New chat</span>
          </button>
          <div className="cc-side-section">Current</div>
          <div className="cc-side-current">
            {messages.length === 0
              ? <span style={{ color: palette.muted }}>Empty conversation</span>
              : <span style={{ color: palette.text }}>
                  {(messages.find((m) => m.role === 'user')?.content || 'New chat').slice(0, 40)}
                </span>}
          </div>
        </div>
        <div className="cc-side-bottom">
          <div className="cc-side-foot">
            <span className="cc-mono">v0.1 · powered by LangChain</span>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="cc-scrim" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="cc-main">
        <header className="cc-topbar">
          <button className="cc-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <IconMenu />
          </button>
          <div className="cc-topbar-title">
            <span style={{ color: palette.text }}>Chef Claude</span>
          </div>
          <button className="cc-new-chat-mobile" onClick={newChat} aria-label="New chat">
            <IconPlus size={16} />
          </button>
        </header>

        <div className="cc-scroll" ref={scrollRef}>
          <div className="cc-thread">
            {messages.length === 0 ? (
              <EmptyState palette={palette} onPick={(t) => send(t)} />
            ) : (
              <div className="cc-messages">
                {messages.map((m, i) => (
                  <Bubble key={i} msg={m} palette={palette} isLast={i === messages.length - 1} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="cc-composer-wrap">
          <div className="cc-composer">
            <textarea
              ref={(el) => { inputRef.current = el; taRef.current = el; }}
              className="cc-input"
              placeholder="Ask Chef Claude anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              disabled={busy}
            />
            <div className="cc-composer-foot">
              <span className="cc-hint cc-mono">
                {busy ? 'Thinking…' : 'Enter to send · Shift+Enter for newline'}
              </span>
              <button
                className="cc-send"
                onClick={() => send()}
                disabled={!input.trim() || busy}
                aria-label="Send message">
                <IconSend />
              </button>
            </div>
          </div>
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette" />
        <TweakRadio
          label="Dark theme"
          value={tweaks.palette}
          options={[
            { value: 'slate', label: 'Slate' },
            { value: 'midnight', label: 'Midnight' },
            { value: 'obsidian', label: 'Obsidian' },
            { value: 'espresso', label: 'Espresso' },
          ]}
          onChange={(v) => setTweak('palette', v)}
        />
        <div style={{ fontSize: 11, color: 'rgba(41,38,27,.55)', lineHeight: 1.45, paddingTop: 4 }}>
          Four dark variants. Each shifts the surface tone, accent hue, and bubble color.
        </div>
      </TweaksPanel>
    </div>
  );
}

export default ChatApp
