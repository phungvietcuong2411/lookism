import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chapters, getChapterById, saveProgress } from '../../data/index';

/* ─────────────────────────────────────────────
   Reusable overlay panel
───────────────────────────────────────────── */
const OverlayPanel = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-100 bg-black/90 flex flex-col">
    <div className="flex justify-between items-center px-5 py-3.5 border-b border-white/10 text-white shrink-0">
      <span className="font-bold text-[15px] tracking-[0.3px]">{title}</span>
      <button
        onClick={onClose}
        className="bg-white/10 border-none rounded-full w-9 h-9 text-white cursor-pointer text-2xl flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        ×
      </button>
    </div>
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   FAB Item  ←←← PHẦN ĐÃ SỬA
───────────────────────────────────────────── */
const FabItem = ({ label, icon, visible, delay, onClick, color }) => (
  <div
    className={`flex items-center gap-2.5 flex-row-reverse transition-all duration-200
      ${visible ? 'pointer-events-auto' : 'pointer-events-none'}
      ${visible
        ? 'opacity-100 translate-y-0 scale-100'
        : 'opacity-0 translate-y-3 scale-95'
      }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <button
      onClick={onClick}
      title={label}
      className={`w-11 h-11 rounded-full border-none cursor-pointer text-white text-xl flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.3)] shrink-0 transition-transform active:scale-95`}
      style={{ backgroundColor: color }}
    >
      {icon}
    </button>
    <span className="bg-black/75 text-white text-xs font-semibold px-3 py-1 rounded-md whitespace-nowrap backdrop-blur-sm">
      {label}
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   FAB + all panels
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   FAB + all panels  ←←← ĐÃ SỬA
───────────────────────────────────────────── */
const FAB = ({ onHome, onPrev, onNext, hasPrev, hasNext, pages, currentPage, onJumpPage, currentChapId, onJumpChapter }) => {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(null);

  const toggle = () => {
    setOpen((v) => !v);
    setPanel(null);
  };

  const openPanel = (name) => {
    setPanel(name);
    setOpen(false);
  };
  const closePanel = () => setPanel(null);

  /* ── Page list panel ── */
  const PageListPanel = () => (
    <OverlayPanel title="Danh sách trang" onClose={closePanel}>
      <div className="flex-1 overflow-y-auto p-4 flex flex-wrap justify-center gap-3 content-start">
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => { onJumpPage(idx); closePanel(); }}
            className={`w-40 h-60 bg-transparent border-2 rounded-xl overflow-hidden cursor-pointer p-0 relative transition-all shrink-0 ${currentPage === idx
              ? 'border-[#1754cf] shadow-lg'
              : 'border-white/15 hover:border-white/30'
              }`}
          >
            <img src={page.src} alt={page.alt} className="w-full h-full object-cover block" />
            <div className={`absolute bottom-0 left-0 right-0 text-white text-[11px] font-bold text-center py-0.5 transition-colors ${currentPage === idx ? 'bg-[#1754cf]' : 'bg-black/65'
              }`}>
              {idx + 1}
            </div>
          </button>
        ))}
      </div>
    </OverlayPanel>
  );

  /* ── Chapter list panel ── */
  const ChapterListPanel = () => (
    <OverlayPanel title="Danh sách chương" onClose={closePanel}>
      <div className="flex-1 overflow-y-auto">
        {chapters.map((chap) => {
          const isCurrent = chap.id === currentChapId;
          return (
            <button
              key={chap.id}
              onClick={() => { onJumpChapter(chap.id); closePanel(); }}
              className={`w-full border-none border-b border-white/10 text-white cursor-pointer px-5 py-3.5 flex items-center justify-between text-left transition-colors ${isCurrent ? 'bg-[#1754cf]/25' : 'hover:bg-white/10'
                }`}
            >
              <div>
                <div className={`font-${isCurrent ? 'bold' : 'medium'} text-sm ${isCurrent ? 'text-[#6a9fff]' : 'text-white'}`}>
                  {chap.title}
                </div>
                <div className="text-[11px] text-white/45 mt-1">
                  {chap.arc.name} · {chap.pages.length} trang · {chap.updatedAt}
                </div>
              </div>
              {isCurrent && (
                <span className="text-[10px] bg-[#1754cf] text-white px-2 py-0.5 rounded font-bold tracking-[0.5px] shrink-0 ml-3">
                  ĐANG ĐỌC
                </span>
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

      {/* FAB Container - CHỈ CÒN 1 NÚT KHI ĐÓNG */}
      <div className="fixed bottom-7 right-6 z-200">

        {/* Menu items - absolute, không chiếm chỗ khi đóng */}
        <div className={`absolute bottom-16 right-0 flex flex-col items-end gap-3 transition-all duration-300 origin-bottom-right
          ${open
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
          }`}
        >
          <FabItem label="Danh sách chương" icon="📋" visible={open} delay={0} onClick={() => openPanel('chapters')} color="#0e7490" />
          <FabItem label="Danh sách ảnh" icon="🖼" visible={open} delay={50} onClick={() => openPanel('pages')} color="#6c3de8" />
          <FabItem label="Chương sau" icon="▶" visible={open && hasNext} delay={100} onClick={() => { onNext(); setOpen(false); }} color="#1754cf" />
          <FabItem label="Chương trước" icon="◀" visible={open && hasPrev} delay={150} onClick={() => { onPrev(); setOpen(false); }} color="#1754cf" />
          <FabItem label="Trang chủ" icon="🏠" visible={open} delay={200} onClick={() => { onHome(); setOpen(false); }} color="#0a7c59" />
        </div>

        {/* Main FAB button */}
        <button
          onClick={toggle}
          className={`w-14 h-14 rounded-full border-none cursor-pointer text-white text-[22px] flex items-center justify-center shadow-2xl transition-all duration-300 ${open ? 'bg-[#1e293b] rotate-45' : 'bg-[#1754cf]'
            }`}
          title="Menu"
        >
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
  const chapter = getChapterById(chapId);

  if (!chapter) {
    return (
      <div className="text-white p-10">
        Chapter không tồn tại.
      </div>
    );
  }
  const pages = chapter.pages;

  const [currentPage, setCurrentPage] = useState(0);

  // Save progress to localStorage whenever chapter changes
  useEffect(() => {
    setCurrentPage(0);
    saveProgress(chapId);
  }, [chapId]);

  const currentIndex = chapters.findIndex(c => c.id === chapId);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < chapters.length - 1;

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

  const page = pages[currentPage] || pages[0];

  return (
    <div
      className="bg-[#111] min-h-dvh h-dvh flex flex-col select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top info bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md px-4 py-2 flex items-center justify-between text-white text-sm">
        <span className="font-bold tracking-[0.3px]">{chapter.title}</span>
        <span className="opacity-75">
          {currentPage + 1} / {pages.length}
        </span>
      </div>

      {/* Page viewer */}
      <div className="flex-1 flex items-center justify-center pt-11 pb-1 relative overflow-hidden">

        {/* LEFT HALF → Trang trước */}
        <div
          onClick={goPrev}
          className={`absolute left-0 top-11 bottom-0 w-1/2 z-10 transition-colors
      ${currentPage > 0
              ? 'cursor-pointer active:bg-white/10'
              : 'cursor-default'
            }`}
        />

        <img
          key={currentPage}
          src={page.src}
          alt={page.alt}
          className="max-w-full max-h-full w-auto h-full object-contain block pointer-events-none animate-fadeIn"
          draggable={false}
        />

        {/* RIGHT HALF → Trang sau */}
        <div
          onClick={goNext}
          className={`absolute right-0 top-11 bottom-0 w-1/2 z-10 transition-colors
      ${currentPage < pages.length - 1
              ? 'cursor-pointer active:bg-white/10'
              : 'cursor-default'
            }`}
        />
      </div>

      {/* Bottom progress bar */}
      <div className="h-0.75 bg-white/10 shrink-0">
        <div
          className="h-full bg-[#1754cf] transition-[width] duration-300"
          style={{
            width: `${((currentPage + 1) / pages.length) * 100}%`,
          }}
        />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 px-4 py-2.5 bg-black/60 shrink-0 flex-nowrap overflow-x-auto">
        {pages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx)}
            className={`h-2 border-none cursor-pointer transition-all shrink-0 rounded ${currentPage === idx
              ? 'w-5 bg-[#1754cf]'
              : 'w-2 bg-white/30'
              }`}
          />
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.18s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Chapter;