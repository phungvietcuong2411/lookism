const modules = import.meta.glob('./chapters/*.js', { eager: true });

export const chapters = Object.values(modules)
    .map((m) => m.default)
    .sort((a, b) => a.id - b.id);

export const getChapterById = (id) =>
    chapters.find((c) => c.id === Number(id));

export const getArcGroups = () => {
    const map = new Map();

    chapters.forEach((chap) => {
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

export const saveProgress = (chapterId) => {
    localStorage.setItem(LS_KEY, String(chapterId));
};

export const loadProgress = () => {
    const val = localStorage.getItem(LS_KEY);
    return val ? Number(val) : null;
};