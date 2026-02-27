import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { chapters, spoils, getArcGroups, loadProgress } from '../../data/index';
import Donate from '../../assets/donate.jpg';

const Home = () => {
    const navigate = useNavigate();
    const savedProgress = loadProgress(); // { id, type }
    const arcGroups = getArcGroups(chapters); // We can still show arcs for chapters

    const latestChapter = chapters[chapters.length - 1];

    // Sort state: 'desc' = newest first (default), 'asc' = oldest first
    const [sortOrder, setSortOrder] = useState('desc');
    // Search state
    const [searchInput, setSearchInput] = useState('');
    const [highlightId, setHighlightId] = useState(null);
    const [activeTab, setActiveTab] = useState('chapter');

    // Refs map: chapId → <tr> element
    const rowRefs = useRef({});

    const currentList = activeTab === 'chapter' ? chapters : spoils;
    const sortedList = sortOrder === 'desc'
        ? [...currentList].reverse()
        : [...currentList];

    const handleSearch = () => {
        const num = parseInt(searchInput, 10);
        if (!num) return;
        const found = currentList.find((c) => c.id === num);
        if (!found) return;

        setHighlightId(num);

        setTimeout(() => {
            const el = rowRefs.current[num];
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);

        setTimeout(() => setHighlightId(null), 2500);
    };

    const handleSearchKey = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleContinueReading = () => {
        if (savedProgress) {
            navigate(`/${savedProgress.type}/${savedProgress.id}`);
        } else if (latestChapter) {
            navigate(`/chapter/${latestChapter.id}`);
        }
    };

    return (
        <div className="bg-background-light min-h-screen mb-10">
            {/* ── Banner + Manga info ── */}
            <div className="relative mb-8">
                <div className="h-52 sm:h-72 w-full overflow-hidden relative">
                    <img
                        alt="Banner"
                        className="w-full h-full object-cover opacity-30"
                        src='https://res.cloudinary.com/dcfrn5c4g/image/upload/v1772013904/a1_vjysr2.jpg'
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background-light to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-28 sm:-mt-40 relative z-10">
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                        {/* Cover */}
                        <div className="w-32 sm:w-48 md:w-56 shrink-0 shadow-xl">
                            <img
                                className="w-full h-auto border-black"
                                src='https://res.cloudinary.com/dcfrn5c4g/image/upload/v1772014915/aa1_v2fggl.jpg'
                                alt="Cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 pt-0 sm:pt-20">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-2 py-1 text-white text-[10px] font-bold uppercase bg-slate-700">
                                    Đang tiến hành
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight uppercase">
                                lookism
                            </h1>

                            <p className="text-base text-slate-600 flex items-center gap-2 mb-4">
                                Tác giả:{' '}
                                <span className="font-bold text-[#1754cf] hover:underline uppercase">
                                    Park Tae-joon
                                </span>
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-6 items-center border-t border-slate-200 pt-4 mb-5">
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                    Tổng số chương:{' '}
                                    <span className="text-lg font-bold text-slate-900">{chapters.length}</span>
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                    Số bản spoil:{' '}
                                    <span className="text-lg font-bold text-slate-900">{spoils.length}</span>
                                </span>
                                {savedProgress && (
                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                        Đang đọc:{' '}
                                        <span className="text-lg font-bold text-[#1754cf]">
                                            {savedProgress.type === 'spoil' ? 'Spoil ' : 'Chương '}
                                            {savedProgress.id}
                                        </span>
                                    </span>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-3">
                                {chapters.length > 0 && (
                                    <button
                                        onClick={() => navigate(`/chapter/${chapters[0].id}`)}
                                        className="px-6 py-3 bg-[#1754cf] text-white font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition-colors"
                                    >
                                        Đọc từ đầu
                                    </button>
                                )}
                                <button
                                    onClick={handleContinueReading}
                                    className="px-6 py-3 border-2 border-slate-900 font-bold uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-colors"
                                >
                                    {savedProgress ? `Đọc tiếp (${savedProgress.type === 'spoil' ? 'Spoil' : 'Chương'} ${savedProgress.id})` : 'Đọc mới nhất'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main body ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-8 lg:px-36 mb-12">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Synopsis */}
                    <section className="bg-white p-6 border border-slate-200 shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Nội dung</h3>
                        <div className="text-slate-600 leading-relaxed">
                            <p>
                                Park Daniel (Park Hyunsuk) là cậu bé thừa cân và kém hấp dẫn, thường xuyên bị bắt
                                nạt ở trường. Khi mẹ chứng kiến cậu bị bắt nạt, bà quyết định chuyển trường cho
                                cậu tới trung tâm Seoul. Tại đây một điều kì lạ xảy ra — anh thức dậy với một
                                thân hình hoàn toàn khác và mọi thứ bắt đầu thay đổi.
                            </p>
                        </div>
                    </section>

                    {/* Chapter / Spoil list */}
                    <section className="bg-white p-6 border border-slate-200 shadow-sm">
                        <div className="flex gap-4 mb-6 border-b border-slate-200">
                            <button
                                className={`pb-3 text-lg font-bold uppercase tracking-wider transition-colors ${activeTab === 'chapter' ? 'text-[#1754cf] border-b-2 border-[#1754cf]' : 'text-slate-400 hover:text-slate-700'}`}
                                onClick={() => setActiveTab('chapter')}
                            >
                                Chính thức
                            </button>
                            <button
                                className={`pb-3 text-lg font-bold uppercase tracking-wider transition-colors ${activeTab === 'spoil' ? 'text-[#1754cf] border-b-2 border-[#1754cf]' : 'text-slate-400 hover:text-slate-700'}`}
                                onClick={() => setActiveTab('spoil')}
                            >
                                Spoil
                            </button>
                        </div>

                        {/* Header row */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                            <h3 className="text-md font-bold flex-1 text-slate-700">
                                {activeTab === 'chapter' ? 'Danh sách chương' : 'Danh sách spoiler'}
                            </h3>

                            {/* Search */}
                            <div className="flex items-center gap-2">
                                <div className="flex border border-slate-300 overflow-hidden">
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Số chương..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={handleSearchKey}
                                        className="px-3 py-2 text-sm w-32 outline-none bg-white text-slate-800 placeholder-slate-400"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="px-3 py-2 bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-colors whitespace-nowrap"
                                    >
                                        Tìm
                                    </button>
                                </div>

                                {/* Sort toggle */}
                                <button
                                    onClick={() => setSortOrder((o) => o === 'desc' ? 'asc' : 'desc')}
                                    title={sortOrder === 'desc' ? 'Đang: mới → cũ. Bấm để đổi' : 'Đang: cũ → mới. Bấm để đổi'}
                                    className="flex items-center gap-1 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors whitespace-nowrap"
                                >
                                    {sortOrder === 'desc' ? '↓ Mới nhất' : '↑ Cũ nhất'}
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="py-3 px-4 text-xs font-bold uppercase text-slate-500 tracking-wider w-2/3">
                                            Tên {activeTab === 'chapter' ? 'chương' : 'spoil'}
                                        </th>
                                        <th className="py-3 px-4 text-xs font-bold uppercase text-slate-500 tracking-wider hidden sm:table-cell">
                                            Arc
                                        </th>
                                        <th className="py-3 px-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">
                                            Cập nhật
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {sortedList.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-slate-500">
                                                Chưa có dữ liệu.
                                            </td>
                                        </tr>
                                    )}
                                    {sortedList.map((chap) => {
                                        const isHighlighted = highlightId === chap.id;
                                        const isCurrent = savedProgress?.id === chap.id && savedProgress?.type === activeTab;
                                        return (
                                            <tr
                                                key={chap.id}
                                                ref={(el) => { rowRefs.current[chap.id] = el; }}
                                                className="group cursor-pointer transition-colors"
                                                style={{
                                                    background: isHighlighted
                                                        ? 'rgba(23,84,207,0.08)'
                                                        : 'transparent',
                                                    outline: isHighlighted ? '2px solid #1754cf' : 'none',
                                                    outlineOffset: '-2px',
                                                }}
                                                onClick={() => navigate(`/${activeTab}/${chap.id}`)}
                                                onMouseEnter={(e) => { if (!isHighlighted) e.currentTarget.style.background = '#f8fafc'; }}
                                                onMouseLeave={(e) => { if (!isHighlighted) e.currentTarget.style.background = 'transparent'; }}
                                            >
                                                <td className="py-4 px-4">
                                                    <span className={`font-semibold group-hover:text-[#1754cf] ${isCurrent ? 'text-[#1754cf]' : 'text-slate-900'}`}>
                                                        {chap.title}
                                                        {isCurrent && (
                                                            <span className="ml-2 text-[10px] bg-[#1754cf] text-white px-1.5 py-0.5 font-bold uppercase">
                                                                Đang đọc
                                                            </span>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 hidden sm:table-cell">
                                                    <span className="text-xs text-slate-500 font-medium">{chap?.arc?.name}</span>
                                                </td>
                                                <td className="py-4 px-4 text-right text-sm text-slate-500">
                                                    {chap.updatedAt}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Right column — Arc list */}
                <div className="space-y-8">
                    <section className="bg-white p-6 border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold mb-6">Các Arc Truyện</h3>
                        <div className="space-y-4">
                            {arcGroups.map((arc, idx) => (
                                <div
                                    key={arc.arcId}
                                    className="border-l-4 pl-4 py-1 cursor-pointer group transition-colors"
                                    style={{ borderColor: idx === 0 ? '#1754cf' : '#e2e8f0' }}
                                    onClick={() => navigate(`/chapter/${arc.firstChapterId}`)}
                                >
                                    <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-[#1754cf] transition-colors">
                                        {arc.arcName}
                                    </h4>
                                    <p className="text-xs text-slate-500 mb-1">{arc.count} chương</p>
                                    <span className="text-[10px] font-bold text-[#1754cf] uppercase">
                                        Chương {arc.firstChapterId} – {arc.lastChapterId}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Donate section moved to bottom */}
            <div className="px-4 sm:px-8 lg:px-36">
                <section className="bg-white p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center max-w-2xl mx-auto rounded-xl">
                    <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-[#1754cf]">Nạp tiền vào donate cho tao</h3>
                    <img src={Donate} alt="QR donate" className="w-64 max-w-full rounded-lg shadow-md" />
                </section>
            </div>
        </div>
    );
};

export default Home;