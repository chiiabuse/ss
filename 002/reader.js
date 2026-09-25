(() => {
  'use strict';

  const PREFIX = 'muchama-academy-';
  const PROGRESS_KEY = PREFIX + 'progress-v1';
  const UNLOCKED_KEY = PREFIX + 'chapter-unlocked-v1';
  const CHAPTER_PAGES = ['chapter1.html', 'chapter2.html', 'chapter3.html', 'chapter4.html', 'chapter5.html', 'chapter6.html'];
  const BAD_CHAPTERS = { '01': 0, '02': 1, '03': 2, '04': 3, '05': 4, '06': 5 };
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
        unlocked = Math.max(unlocked, reached);
      }
    } catch (_) { /* 古い保存形式でも目次は表示する */ }

    document.querySelector('[data-chapters-section]').hidden = unlocked < 0;
    for (const entry of document.querySelectorAll('[data-chapter-index]')) {
      entry.hidden = Number(entry.dataset.chapterIndex) > unlocked;
    }

    let hasSeenEnd = false;
    for (const entry of document.querySelectorAll('[data-end-entry]')) {
      const id = entry.dataset.endEntry;
      if (storage.get(PREFIX + 'end-' + id + '-seen-v1') === '1') {
        entry.hidden = false;
        entry.querySelector('[data-end-link]').hidden = false;
        hasSeenEnd = true;
      }
    }
    document.querySelector('[data-ends-section]').hidden = !hasSeenEnd;

    document.querySelector('[data-reset-history]').addEventListener('click', () => {
      if (!confirm('続きから読む・選択履歴・エンディング一覧の記録をすべて消去しますか？')) return;
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
    // 改行ごとに文頭を作り、空行がある箇所だけ段落間の余白を加える。
    for (const story of document.querySelectorAll('.story-text')) {
      const lines = story.textContent.replace(/\r\n?/g, '\n').split('\n');
      const blocks = [];
      let hasBlankLine = false;
      for (const line of lines) {
        if (/^[ \t\u3000]*$/.test(line)) {
          if (blocks.length) hasBlankLine = true;
          continue;
        }
        const block = document.createElement('span');
        block.className = 'story-paragraph';
        // 原稿に字下げが既にある場合は一字だけ取り除き、CSSと二重にしない。
        block.textContent = line.replace(/^\u3000/, '');
        if (hasBlankLine) block.classList.add('story-paragraph-break');
        if (/^[ \t\u3000]*[「『]/.test(block.textContent)) {
          block.classList.add('is-quoted');
        }
        blocks.push(block);
        hasBlankLine = false;
      }
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
