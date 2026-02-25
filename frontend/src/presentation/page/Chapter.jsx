import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chapters, getChapterById, saveProgress } from '../../data/index';

/* ─────────────────────────────────────────────
   Reusable overlay panel
───────────────────────────────────────────── */
const OverlayPanel = ({ title, onClose, children }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 100,
    background: 'rgba(0,0,0,0.88)',
    display: 'flex', flexDirection: 'column',
  }}>
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.13)',
      color: '#fff', flexShrink: 0,
    }}>
      <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.3 }}>{title}</span>
      <button onClick={onClose} style={{
        background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
        width: 36, height: 36, color: '#fff', cursor: 'pointer',
        fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>×</button>
    </div>
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   FAB Item
───────────────────────────────────────────── */
const FabItem = ({ label, icon, visible, delay, onClick, color }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.85)',
    transition: `opacity 0.22s ${delay}ms, transform 0.22s ${delay}ms`,
    pointerEvents: visible ? 'auto' : 'none',
    flexDirection: 'row-reverse',
  }}>
    <button onClick={onClick} title={label} style={{
      width: 44, height: 44, borderRadius: '50%', background: color,
      border: 'none', cursor: 'pointer', color: '#fff', fontSize: 18,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)', flexShrink: 0,
    }}>{icon}</button>
    <span style={{
      background: 'rgba(0,0,0,0.75)', color: '#fff', borderRadius: 6,
      padding: '4px 10px', fontSize: 12, fontWeight: 600,
      whiteSpace: 'nowrap', backdropFilter: 'blur(4px)',
    }}>{label}</span>
  </div>
);

/* ─────────────────────────────────────────────
   FAB + all panels
───────────────────────────────────────────── */
const FAB = ({ onHome, onPrev, onNext, hasPrev, hasNext, pages, currentPage, onJumpPage, currentChapId, onJumpChapter }) => {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(null); // null | 'pages' | 'chapters'

  const toggle = () => {
    setOpen((v) => !v);
    setPanel(null);
  };

  const openPanel = (name) => { setPanel(name); setOpen(false); };
  const closePanel = () => setPanel(null);

  /* ── Page list panel ── */
  const PageListPanel = () => (
    <OverlayPanel title="Danh sách trang" onClose={closePanel}>
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '12px', alignContent: 'start',
      }}>
        {pages.map((page, idx) => (
          <button key={idx} onClick={() => { onJumpPage(idx); closePanel(); }} style={{
            background: 'none',
            border: currentPage === idx ? '2px solid #1754cf' : '2px solid rgba(255,255,255,0.15)',
            borderRadius: 8, overflow: 'hidden', cursor: 'pointer', padding: 0,
            position: 'relative', transition: 'border-color 0.2s',
          }}>
            <img src={page.src} alt={page.alt} style={{
              width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: currentPage === idx ? '#1754cf' : 'rgba(0,0,0,0.65)',
              color: '#fff', fontSize: 11, fontWeight: 700,
              textAlign: 'center', padding: '3px 0',
            }}>{idx + 1}</div>
          </button>
        ))}
      </div>
    </OverlayPanel>
  );

  /* ── Chapter list panel ── */
  const ChapterListPanel = () => (
    <OverlayPanel title="Danh sách chương" onClose={closePanel}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {chapters.map((chap) => {
          const isCurrent = chap.id === currentChapId;
          return (
            <button
              key={chap.id}
              onClick={() => { onJumpChapter(chap.id); closePanel(); }}
              style={{
                width: '100%', background: isCurrent ? 'rgba(23,84,207,0.25)' : 'transparent',
                border: 'none', borderBottom: '1px solid rgba(255,255,255,0.07)',
                color: '#fff', cursor: 'pointer', padding: '14px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                textAlign: 'left', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = 'transparent'; }}
            >
              <div>
                <div style={{
                  fontWeight: isCurrent ? 700 : 500,
                  fontSize: 14,
                  color: isCurrent ? '#6a9fff' : '#fff',
                }}>{chap.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>
                  {chap.arc.name} · {chap.pages.length} trang · {chap.updatedAt}
                </div>
              </div>
              {isCurrent && (
                <span style={{
                  fontSize: 10, background: '#1754cf', color: '#fff',
                  padding: '2px 7px', borderRadius: 3, fontWeight: 700,
                  letterSpacing: 0.5, flexShrink: 0, marginLeft: 12,
                }}>ĐANG ĐỌC</span>
              )}
            </button>
          );
        })}
      </div>
    </OverlayPanel>
  );

  return (
    <>
      {panel === 'pages' && <PageListPanel />}
      {panel === 'chapters' && <ChapterListPanel />}

      {/* FAB + radial menu */}
      <div style={{ position: 'fixed', bottom: 28, right: 24, zIndex: 200 }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 10, marginBottom: 10,
          pointerEvents: open ? 'auto' : 'none',
        }}>
          <FabItem label="Danh sách chương" icon="📋" visible={open} delay={0}
            onClick={() => openPanel('chapters')} color="#0e7490" />
          <FabItem label="Danh sách ảnh" icon="🖼" visible={open} delay={50}
            onClick={() => openPanel('pages')} color="#6c3de8" />
          <FabItem label="Chương sau" icon="▶" visible={open && hasNext} delay={100}
            onClick={() => { onNext(); setOpen(false); }} color="#1754cf" />
          <FabItem label="Chương trước" icon="◀" visible={open && hasPrev} delay={150}
            onClick={() => { onPrev(); setOpen(false); }} color="#1754cf" />
          <FabItem label="Trang chủ" icon="🏠" visible={open} delay={200}
            onClick={() => { onHome(); setOpen(false); }} color="#0a7c59" />
        </div>

        {/* Main FAB button */}
        <button onClick={toggle} style={{
          width: 56, height: 56, borderRadius: '50%',
          background: open ? '#1e293b' : '#1754cf',
          border: 'none', cursor: 'pointer', color: '#fff', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
          transition: 'background 0.25s, transform 0.25s',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }} title="Menu">
          {open ? '✕' : '☰'}
        </button>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   Main Chapter page
───────────────────────────────────────────── */
const Chapter = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const chapId = chapterId ? Number(chapterId) : 1;
  const chapter = getChapterById(chapId) || chapters[0];
  const pages = chapter.pages;

  const [currentPage, setCurrentPage] = useState(0);

  // Save progress to localStorage whenever chapter changes
  useEffect(() => {
    setCurrentPage(0);
    saveProgress(chapId);
  }, [chapId]);

  const hasPrev = chapId > 1;
  const hasNext = chapId < chapters.length;

  const goNext = useCallback(() => {
    if (currentPage < pages.length - 1) setCurrentPage((p) => p + 1);
  }, [currentPage, pages.length]);

  const goPrev = useCallback(() => {
    if (currentPage > 0) setCurrentPage((p) => p - 1);
  }, [currentPage]);

  const goHome = () => navigate('/');
  const goNextChapter = () => navigate(`/chapter/${chapId + 1}`);
  const goPrevChapter = () => navigate(`/chapter/${chapId - 1}`);
  const goToChapter = (id) => navigate(`/chapter/${id}`);

  /* Touch / swipe */
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  /* Keyboard */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  const page = pages[currentPage];

  return (
    <div style={{
      background: '#111', minHeight: '100dvh', height: '100dvh',
      display: 'flex', flexDirection: 'column',
      userSelect: 'none', overflow: 'hidden',
    }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top info bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        padding: '8px 16px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', color: '#fff', fontSize: 13,
        fontFamily: 'system-ui, sans-serif',
      }}>
        <span style={{ fontWeight: 700, letterSpacing: 0.3 }}>{chapter.title}</span>
        <span style={{ opacity: 0.75 }}>{currentPage + 1} / {pages.length}</span>
      </div>

      {/* Page viewer */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: 44, paddingBottom: 4, position: 'relative', overflow: 'hidden',
      }}>
        {/* Left tap zone → prev page */}
        <div onClick={goPrev} style={{
          position: 'absolute', left: 0, top: 44, bottom: 0, width: '20%',
          cursor: currentPage > 0 ? 'pointer' : 'default', zIndex: 10,
        }} />

        <img key={currentPage} src={page.src} alt={page.alt} style={{
          maxWidth: '100%', maxHeight: '100%', width: 'auto', height: '100%',
          objectFit: 'contain', display: 'block', pointerEvents: 'none',
          animation: 'fadeIn 0.18s ease',
        }} draggable={false} />

        {/* Right tap zone → next page */}
        <div onClick={goNext} style={{
          position: 'absolute', right: 0, top: 44, bottom: 0, width: '20%',
          cursor: currentPage < pages.length - 1 ? 'pointer' : 'default', zIndex: 10,
        }} />
      </div>

      {/* Bottom progress bar */}
      <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}>
        <div style={{
          height: '100%', background: '#1754cf',
          width: `${((currentPage + 1) / pages.length) * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Dot indicators */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 6,
        padding: '10px 16px', background: 'rgba(0,0,0,0.6)',
        flexShrink: 0, flexWrap: 'nowrap', overflowX: 'auto',
      }}>
        {pages.map((_, idx) => (
          <button key={idx} onClick={() => setCurrentPage(idx)} style={{
            width: currentPage === idx ? 20 : 8, height: 8, borderRadius: 4,
            background: currentPage === idx ? '#1754cf' : 'rgba(255,255,255,0.3)',
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'width 0.25s, background 0.25s', flexShrink: 0,
          }} />
        ))}
      </div>

      {/* FAB */}
      <FAB
        onHome={goHome}
        onPrev={goPrevChapter}
        onNext={goNextChapter}
        hasPrev={hasPrev}
        hasNext={hasNext}
        pages={pages}
        currentPage={currentPage}
        onJumpPage={setCurrentPage}
        currentChapId={chapId}
        onJumpChapter={goToChapter}
      />

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

export default Chapter;