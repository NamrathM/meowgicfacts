import React, { useState, useEffect, useRef } from 'react';

const terminalThemes = {
  dark: {
    background: '#181a1b',
    card: '#23272a',
    border: '#444b53',
    text: '#39FF14',
    accent: '#FFD700',
    buttonBg: '#181a1b',
    buttonText: '#39FF14',
    buttonGlow: '#FFD700',
    buttonHoverBg: '#23272a',
    error: '#ff5555',
    placeholder: '#7afc7a',
    prompt: '#FFD700',
    cursor: '#39FF14',
    subheading: '#fff',
    scanline: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 3px, transparent 4px)',
  },
  light: {
    background: '#f7f7f7',
    card: '#fff',
    border: '#bdbdbd',
    text: '#1a1a1a',
    accent: '#1845ad',
    buttonBg: '#fff',
    buttonText: '#1845ad',
    buttonGlow: '#FFD700',
    buttonHoverBg: '#e3e3e3',
    error: '#d7263d',
    placeholder: '#1845ad',
    prompt: '#FFD700',
    cursor: '#1845ad',
    subheading: '#1845ad',
    scanline: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 3px, transparent 4px)',
  }
};

// Main App component
function App() {
  // State to hold the fetched fact
  const [fact, setFact] = useState('');
  // State to handle loading state
  const [loading, setLoading] = useState(false);
  // State to handle errors
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [typedFact, setTypedFact] = useState('');
  const [showCommand, setShowCommand] = useState(false);
  const [showBoot, setShowBoot] = useState(true);
  const [bootStep, setBootStep] = useState(0);
  const typingTimeout = useRef();

  const theme = darkMode ? terminalThemes.dark : terminalThemes.light;

  // Boot animation steps
  const bootMessages = [
    'Booting Meowgic Terminal... ',
    'Loading modules... ',
    'Establishing connection to Cat Fact Server... ',
    'Welcome to Meowgic Facts!'
  ];

  // Boot animation
  useEffect(() => {
    if (!showBoot) return;
    if (bootStep < bootMessages.length) {
      const timeout = setTimeout(() => setBootStep(bootStep + 1), 900);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setShowBoot(false), 1200);
    }
  }, [bootStep, showBoot]);

  // Typing animation for the fact
  useEffect(() => {
    if (!fact || error) {
      setTypedFact('');
      return;
    }
    setTypedFact('');
    let i = 0;
    function typeChar() {
      setTypedFact(fact.slice(0, i));
      if (i < fact.length) {
        typingTimeout.current = setTimeout(typeChar, 40 + Math.random() * 20);
        i++;
      }
    }
    typeChar();
    return () => clearTimeout(typingTimeout.current);
  }, [fact, error]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(c => !c), 500);
    return () => clearInterval(interval);
  }, []);

  // Global style reset
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.background = theme.background;
    document.body.style.transition = 'background 0.4s';
  }, [theme.background]);

  // Fetch a random cat fact
  const fetchCatFact = async () => {
    setLoading(true);
    setError(null);
    setShowCommand(true);
    setTypedFact('');
    setFact('');
    try {
      const response = await fetch('https://catfact.ninja/fact');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTimeout(() => setFact(data.fact), 500); // delay for command echo
    } catch (err) {
      setError('Failed to fetch a cat fact.');
    } finally {
      setLoading(false);
    }
  };

  // Scanline overlay style
  const scanlineStyle = {
    pointerEvents: 'none',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    opacity: 0.25,
    background: theme.scanline,
    borderRadius: 8,
    mixBlendMode: darkMode ? 'screen' : 'multiply',
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.background,
      fontFamily: 'Fira Mono, Consolas, Menlo, monospace',
      transition: 'background 0.4s',
    }}>
      <div style={{
        maxWidth: 700,
        width: '98%',
        background: theme.card,
        border: `2.5px solid ${theme.border}`,
        borderRadius: 8,
        padding: '2.5rem 2rem',
        boxShadow: '0 0 32px 0 #000a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        transition: 'background 0.4s',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Scanline overlay */}
        <div style={scanlineStyle}></div>
        {/* Terminal bar and theme toggle */}
        <div style={{
          width: '100%',
          height: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 18,
          justifyContent: 'space-between',
          zIndex: 3,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#ff5f56', marginRight: 4 }}></span>
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', marginRight: 4 }}></span>
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }}></span>
          </div>
          <button
            aria-label="Toggle theme"
            onClick={() => setDarkMode((d) => !d)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 20,
              color: theme.text,
              transition: 'color 0.3s',
              outline: 'none',
              marginRight: 2,
              zIndex: 4,
            }}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
        {/* Boot animation */}
        {showBoot ? (
          <div style={{
            color: darkMode ? '#fff' : '#000',
            fontFamily: 'inherit',
            fontSize: '1.1rem',
            minHeight: 120,
            width: '100%',
            zIndex: 4,
            padding: '2rem 0',
            letterSpacing: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}>
            {bootMessages.slice(0, bootStep + 1).map((msg, idx) => (
              <div key={idx}>
                <span style={{ color: theme.prompt, fontWeight: 700 }}>&gt; </span>
                {msg}
                {idx === bootStep && showCursor && <span style={{ color: theme.cursor, fontWeight: 900 }}>_</span>}
              </div>
            ))}
          </div>
        ) : <>
        <h1 style={{
          color: theme.text,
          marginBottom: '0.5rem',
          fontSize: '2.2rem',
          fontWeight: 700,
          letterSpacing: 1,
          fontFamily: 'inherit',
          zIndex: 3,
        }}>
          Meowgic Facts
        </h1>
        <div style={{
          color: theme.subheading,
          fontSize: '1.1rem',
          marginBottom: '1.5rem',
          fontWeight: 500,
          opacity: 0.85,
          fontFamily: 'inherit',
          zIndex: 3,
        }}>
          Random Cat Facts
        </div>
        <button
          onClick={fetchCatFact}
          disabled={loading}
          style={{
            background: (isHovered || loading) ? theme.buttonText : theme.buttonBg,
            color: (isHovered || loading) ? theme.buttonBg : theme.buttonText,
            border: `2px solid ${theme.buttonText}`,
            padding: '12px 32px',
            borderRadius: 4,
            fontSize: '1.1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontWeight: 700,
            marginBottom: 32,
            marginLeft: 0,
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'background 0.2s, color 0.2s, transform 0.15s',
            letterSpacing: 1,
            zIndex: 3,
            transform: (isHovered || loading) ? 'scale(1.07)' : 'scale(1)',
          }}
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
        >
          {loading ? 'Loading...' : 'Get Cat Fact'}
        </button>
        <div style={{
          background: darkMode ? 'rgba(0,0,0,0.25)' : '#f3f3f3',
          borderRadius: 6,
          padding: '1.5rem',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          marginBottom: 0,
          border: `1.5px solid ${theme.border}`,
          fontFamily: 'inherit',
          zIndex: 3,
          position: 'relative',
        }}>
          {/* Command echo */}
          {showCommand && !loading && !error && (
            <div style={{ color: darkMode ? theme.prompt : '#1845ad', fontWeight: 700, marginBottom: 8 }}>
              $ get-cat-fact
            </div>
          )}
          {error ? (
            <span style={{ color: theme.error, fontWeight: 500 }}>{error}</span>
          ) : typedFact ? (
            <span style={{
              fontSize: '1.15rem',
              lineHeight: 1.7,
              color: theme.text,
              fontFamily: 'inherit',
              wordBreak: 'break-word',
            }}>
              <span style={{ color: theme.prompt, fontWeight: 700 }}>&gt; </span>
              {typedFact}
              {showCursor && typedFact.length !== fact.length && <span style={{ color: theme.cursor, fontWeight: 900 }}>_</span>}
            </span>
          ) : (
            <span style={{ color: theme.placeholder, fontFamily: 'inherit' }}>
              <span style={{ color: theme.prompt, fontWeight: 700 }}>&gt; </span>
              Click the button to get a random cat fact!{showCursor && <span style={{ color: theme.cursor, fontWeight: 900 }}>_</span>}
            </span>
          )}
        </div>
        </>}
      </div>
    </div>
  );
}

export default App; 