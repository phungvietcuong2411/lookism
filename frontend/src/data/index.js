const chapterModules = import.meta.glob('./chapters/*.js', { eager: true });
const spoilModules = import.meta.glob('./spoils/*.js', { eager: true });

export const chapters = Object.values(chapterModules)
    .map((m) => m.default)
    .sort((a, b) => a.id - b.id);

export const spoils = Object.values(spoilModules)
    .map((m) => m.default)
    .sort((a, b) => a.id - b.id);

export const getChapterById = (id, type = 'chapter') => {
    if (type === 'spoil') return spoils.find((c) => c.id === Number(id));
    return chapters.find((c) => c.id === Number(id));
};

export const getArcGroups = (dataSource = chapters) => {
    const map = new Map();

    dataSource.forEach((chap) => {
        const key = chap.arc.id;
        if (!map.has(key)) {
            map.set(key, {
                arcId: chap.arc.id,
                arcName: chap.arc.name,
                chapters: [],
            });
        }
        map.get(key).chapters.push(chap);
    });

    return Array.from(map.values()).map((arc) => ({
        ...arc,
        firstChapterId: arc.chapters[0].id,
        lastChapterId: arc.chapters[arc.chapters.length - 1].id,
        count: arc.chapters.length,
    }));
};

// localStorage helpers
const LS_KEY = 'lookism_reading_progress';

export const saveProgress = (chapterId, type = 'chapter') => {
    localStorage.setItem(LS_KEY, JSON.stringify({ id: String(chapterId), type }));
};

export const loadProgress = () => {
    const val = localStorage.getItem(LS_KEY);
    if (!val) return null;
    try {
        const parsed = JSON.parse(val);
        if (parsed && typeof parsed === 'object') {
            return { id: Number(parsed.id), type: parsed.type || 'chapter' };
        }
    } catch (e) {
        return { id: Number(val), type: 'chapter' };
    }
    return { id: Number(val), type: 'chapter' };
};