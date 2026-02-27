import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './presentation/layout/MainLayout';
import Home from './presentation/page/Home';
import Chapter from './presentation/page/Chapter';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes — with Header + Footer */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
        </Route>

        {/* Chapter reader — standalone, no header/footer */}
        <Route path="/chapter/:chapterId" element={<Chapter type="chapter" />} />
        <Route path="/chapter" element={<Chapter type="chapter" />} />
        <Route path="/spoil/:chapterId" element={<Chapter type="spoil" />} />
        <Route path="/spoil" element={<Chapter type="spoil" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
