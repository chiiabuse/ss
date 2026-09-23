(() => {
  'use strict';

  const PREFIX = 'tensei-chii-';
  const PROGRESS_KEY = PREFIX + 'progress-v1';
  const UNLOCKED_KEY = PREFIX + 'chapter-unlocked-v1';
  const CHAPTER_PAGES = [
    'prologue.html',
    ...Array.from({ length: 10 }, (_, i) => `chapter${i + 1}.html`),
    'final.html'
  ];
  const BAD_CHAPTERS = { '01': 1, '02': 3, '03': 5, '04': 6, '05': 8, '06': 10 };
  const storage = {
    get(key) {
      try { return localStorage.getItem(key); } catch (_) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (_) { /* 閲覧は継続可能 */ }
    }
  };

  function initializeMenu() {
    const allowed = new Set(
      [...document.querySelectorAll('[data-page-link]')]
        .map(link => link.getAttribute('href').split('#')[0])
    );
    const continueLink = document.querySelector('[data-continue-link]');
    const storedUnlock = storage.get(UNLOCKED_KEY);
    let unlocked = storedUnlock === null ? -1 : Number(storedUnlock);
    if (!Number.isInteger(unlocked) || unlocked < -1) unlocked = -1;
    unlocked = Math.min(unlocked, CHAPTER_PAGES.length - 1);
    try {
      const saved = JSON.parse(storage.get(PROGRESS_KEY) || 'null');
      if (saved && allowed.has(saved.page) && Number.isFinite(saved.y)) {
        continueLink.href = saved.page + '#continue';
        continueLink.hidden = false;
        let reached = CHAPTER_PAGES.indexOf(saved.page);
        const bad = /^bad-end-(0[1-6])\.html$/.exec(saved.page);
        if (bad) reached = BAD_CHAPTERS[bad[1]];
        if (saved.page === 'end-a.html' || saved.page === 'end-b.html') reached = 11;
        unlocked = Math.max(unlocked, reached);
      }
    } catch (_) { /* 古い保存形式でも目次は表示する */ }

    document.querySelector('[data-chapters-section]').hidden = unlocked < 0;
    for (const entry of document.querySelectorAll('[data-chapter-index]')) {
      entry.hidden = Number(entry.dataset.chapterIndex) > unlocked;
    }

    for (const entry of document.querySelectorAll('[data-end-entry]')) {
      const id = entry.dataset.endEntry;
      if (storage.get(PREFIX + 'end-' + id + '-seen-v1') === '1') {
        entry.querySelector('[data-end-unread]').hidden = true;
        entry.querySelector('[data-end-link]').hidden = false;
      }
    }

    document.querySelector('[data-reset-history]').addEventListener('click', () => {
      if (!confirm('続きから読む・選択履歴・ＥＮＤ ＬＩＳＴの記録をすべて消去しますか？')) return;
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i);
          if (key && key.startsWith(PREFIX)) keys.push(key);
        }
        keys.forEach(key => localStorage.removeItem(key));
        location.reload();
      } catch (_) {
        alert('記録を消去できませんでした。ブラウザの保存設定を確認してください。');
      }
    });
  }

  function initializeReader(page) {
    // 原稿の空行だけを短い段落間隔にする。原稿自体は一つの要素内に保つ。
    for (const story of document.querySelectorAll('.story-text')) {
      const paragraphs = story.textContent.replace(/\r\n/g, '\n').split(/\n[ \t]*\n+/);
      const blocks = paragraphs.map(paragraph => {
        const block = document.createElement('span');
        block.className = 'story-paragraph';
        block.textContent = paragraph;
        return block;
      });
      story.replaceChildren(...blocks);
    }

    const chapterIndex = CHAPTER_PAGES.indexOf(page);
    if (chapterIndex >= 0) {
      const storedUnlock = storage.get(UNLOCKED_KEY);
      const previous = storedUnlock === null ? -1 : Number(storedUnlock);
      if (!Number.isInteger(previous) || chapterIndex > previous) {
        storage.set(UNLOCKED_KEY, String(chapterIndex));
      }
    }
    const end = document.body.dataset.endId;
    if (end) storage.set(PREFIX + 'end-' + end + '-seen-v1', '1');

    const choiceId = document.body.dataset.choiceId;
    if (choiceId) {
      const key = PREFIX + choiceId + '-choice-v1';
      const correct = document.body.dataset.correct;
      const continuation = document.getElementById('continuation');
      if (storage.get(key) === correct || location.hash === '#continuation') {
        continuation.hidden = false;
      }
      document.querySelector('[data-correct-choice]').addEventListener('click', event => {
        event.preventDefault();
        continuation.hidden = false;
        storage.set(key, correct);
        history.replaceState(null, '', '#continuation');
        continuation.scrollIntoView();
        saveProgress();
      });
    }

    function saveProgress() {
      storage.set(PROGRESS_KEY, JSON.stringify({ page, y: Math.round(scrollY) }));
    }

    addEventListener('load', () => {
      if (location.hash === '#continue') {
        try {
          const saved = JSON.parse(storage.get(PROGRESS_KEY) || 'null');
          if (saved && saved.page === page && Number.isFinite(saved.y)) scrollTo(0, saved.y);
        } catch (_) { /* 不正な記録は無視する */ }
      } else {
        saveProgress();
      }
    });

    let pending = false;
    addEventListener('scroll', () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        saveProgress();
      });
    }, { passive: true });
    addEventListener('pagehide', saveProgress);
  }

  const page = document.body.dataset.page;
  if (page) initializeReader(page);
  else initializeMenu();
})();
