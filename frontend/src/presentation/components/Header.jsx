import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
    const navigate = useNavigate();

    const navLinks = [
        { to: '/', label: 'Trang chủ', requireAuth: false },
        { to: '/category', label: 'Thể loại', requireAuth: false },
        { to: '/follow', label: 'Theo dõi', requireAuth: true },
        { to: '/history', label: 'Lịch sử', requireAuth: true },
    ];

    return (
        <header className="top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-center gap-4">
                <div className="flex items-center gap-6 sm:gap-10">
                    <Link className="flex items-center gap-2" to="/">
                        <span className="text-lg font-black tracking-tighter uppercase hidden sm:block">lookism</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
