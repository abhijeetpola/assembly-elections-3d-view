import React, { useEffect, useState, useMemo, useRef } from 'react';
import './LeaderDetailOverlay.css';

export default function LeaderDetailOverlay({ onClose, imageSrc, partyColor = '#ffffff', initialRect }) {
  const [entered, setEntered] = useState(false);
  const [transitionDone, setTransitionDone] = useState(false);
  const frameRef = useRef(null);
  const cloneRef = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const leaderName = useMemo(() => {
    if (!imageSrc) return 'Leader';
    const base = imageSrc.split('/').pop() || '';
    const name = base.replace(/\.[a-zA-Z0-9]+$/, ''); // remove extension
    return name.charAt(0).toUpperCase() + name.slice(1); // capitalize
  }, [imageSrc]);

  const trailingName = 'Leader6';

  // shared element image transition
  useEffect(() => {
    if (!initialRect || !imageSrc) { setTransitionDone(true); return; }
    const frameEl = frameRef.current;
    if (!frameEl) { setTransitionDone(true); return; }
    const finalRect = frameEl.getBoundingClientRect();
    const img = document.createElement('img');
    img.src = imageSrc;
    img.className = 'leader-image-transition-clone';
    Object.assign(img.style, {
      position: 'fixed',
      left: `${initialRect.x}px`, top: `${initialRect.y}px`,
      width: `${initialRect.width}px`, height: `${initialRect.height}px`,
      borderRadius: '16px',
      objectFit: 'cover', zIndex: 6000,
      boxShadow: '0 4px 18px rgba(0,0,0,0.55)',
      transformOrigin: 'top left',
      transition: 'transform 380ms cubic-bezier(.18,.82,.22,1), border-radius 380ms'
    });
    document.body.appendChild(img);
    cloneRef.current = img;
    const scaleX = finalRect.width / initialRect.width;
    const scaleY = finalRect.height / initialRect.height;
    const dx = finalRect.x - initialRect.x;
    const dy = finalRect.y - initialRect.y;
    requestAnimationFrame(() => {
      img.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
      img.style.borderRadius = '20px';
    });
    const done = () => {
      setTransitionDone(true);
      if (img && img.parentNode) img.parentNode.removeChild(img);
    };
    img.addEventListener('transitionend', done, { once: true });
    return () => { if (img && img.parentNode) img.parentNode.removeChild(img); };
  }, [initialRect, imageSrc]);

  // Close on Escape + initial focus on close button
  const closeBtnRef = useRef(null);
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    if (closeBtnRef.current) closeBtnRef.current.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="leader-overlay-root" role="dialog" aria-modal="true" aria-labelledby="leader-overlay-title">
      <div className="leader-overlay-backdrop" onClick={onClose} />
      <div className={`leader-overlay-wrapper ${entered ? 'entered' : ''}`}>
        <div className="leader-overlay-card glass">
          {imageSrc && (
            <div ref={frameRef} className={`leader-image-frame ${entered && transitionDone ? 'entered' : ''}`} style={{ '--accent': partyColor }}>
              {transitionDone && <img src={imageSrc} alt={leaderName} className="leader-image" draggable={false} />}
              <div className="leader-image-glow" style={{ background: partyColor }} />
            </div>
          )}
          <div className="leader-info">
            <h2 id="leader-overlay-title" className="leader-name" style={{ color: partyColor }}>{leaderName}</h2>
            <div className="field"><span className="label">Constituency:</span><span className="value">Dummy</span></div>
            <div className="field"><span className="label">Party:</span><span className="value">ABC</span></div>
            <div className="field"><span className="label">Alliance:</span><span className="value">NDA</span></div>
            <div className="field"><span className="label">Leading by:</span><span className="value">5,432</span></div>
            <div className="divider" />
            <h3 className="subhead">Trailed by <span className="trailing-name" style={{ color: partyColor }}>{trailingName}</span></h3>
            <div className="field"><span className="label">Party:</span><span className="value">DEF</span></div>
            <div className="field"><span className="label">Alliance:</span><span className="value">INDIA</span></div>
          </div>
        </div>
        <button ref={closeBtnRef} className="close-btn" onClick={onClose} aria-label="Close overlay">×</button>
      </div>
    </div>
  );
}
