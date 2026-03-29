/* ============================================================
   KLEVER MEDIA — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Mobile nav toggle ──────────────────────────────────── */
  const toggle = document.querySelector('.nav__toggle');
  const menu   = document.querySelector('.nav__menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Work card renderer ─────────────────────────────────── */
  /**
   * Renders work cards into a container.
   * @param {HTMLElement} container  - The grid element to render into
   * @param {Array}       posts      - Array of post objects from posts-data.js
   * @param {number}      limit      - Max cards to show (0 = all)
   * @param {string}      basePath   - Relative path prefix for post links
   */
  function renderWorkCards(container, posts, limit, basePath) {
    if (!container || !Array.isArray(posts)) return;

    var items = limit > 0 ? posts.slice(0, limit) : posts;

    if (items.length === 0) {
      container.innerHTML =
        '<div class="work-empty"><p>No work posts yet — check back soon.</p></div>';
      return;
    }

    container.innerHTML = items.map(function (post) {
      var href = post.postFile
        ? basePath + 'work/' + post.postFile
        : '#';

      var thumbHtml = post.thumb
        ? '<img src="' + post.thumb + '" alt="' + escapeHtml(post.title) + '" loading="lazy" width="800" height="450">'
        : '<div class="work-card__thumb-placeholder" aria-hidden="true">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 80" aria-hidden="true">' +
              '<polyline points="45,8 12,40 45,72" fill="none" stroke="#3d71bd" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
          '</div>';

      var linkAttr = href === '#' ? ' aria-disabled="true"' : '';

      return '<article class="work-card" data-category="' + escapeHtml(post.category) + '">' +
        '<div class="work-card__thumb">' + thumbHtml + '</div>' +
        '<div class="work-card__body">' +
          '<p class="work-card__tag">' + escapeHtml(post.category) + '</p>' +
          '<h3>' + escapeHtml(post.title) + '</h3>' +
          '<p>' + escapeHtml(post.excerpt) + '</p>' +
          '<a href="' + href + '" class="work-card__link"' + linkAttr + '>View case study</a>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Render work cards once posts-data.js has fetched ───── */
  document.addEventListener('posts-ready', function () {

  /* ── Home page: work teaser (3 latest posts) ────────────── */
  var teaserGrid = document.getElementById('work-teaser-grid');
  if (teaserGrid) {
    renderWorkCards(teaserGrid, window.POSTS, 3, '');
  }

  /* ── Work page: full grid + category filter ─────────────── */
  var workGrid    = document.getElementById('work-grid');
  var filterBtns  = document.querySelectorAll('.filter-btn');
  var activeFilter = 'all';

  if (workGrid) {
    renderWorkCards(workGrid, window.POSTS, 0, '../');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeFilter = btn.dataset.filter;

        // Update active state
        filterBtns.forEach(function (b) {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });

        // Show/hide cards
        var cards = workGrid.querySelectorAll('.work-card');
        cards.forEach(function (card) {
          if (activeFilter === 'all') {
            card.hidden = false;
          } else {
            card.hidden = !card.dataset.category.includes(activeFilter);
          }
        });

        // Show empty state if none visible
        var visible = workGrid.querySelectorAll('.work-card:not([hidden])');
        var emptyMsg = workGrid.querySelector('.work-empty');
        if (visible.length === 0) {
          if (!emptyMsg) {
            var div = document.createElement('div');
            div.className = 'work-empty';
            div.innerHTML = '<p>No posts in this category yet.</p>';
            workGrid.appendChild(div);
          }
        } else {
          if (emptyMsg) emptyMsg.remove();
        }
      });
    });
  }

  }); // end posts-ready

})();

/* ── Filter button styles (injected) ───────────────────────── */
(function injectFilterStyles() {
  var style = document.createElement('style');
  style.textContent = [
    '.work-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }',
    '.filter-btn {',
    '  padding: 8px 18px;',
    '  border: 1.5px solid var(--border);',
    '  background: var(--white);',
    '  color: var(--text);',
    '  border-radius: 100px;',
    '  font-family: var(--font);',
    '  font-size: 0.875rem;',
    '  font-weight: 500;',
    '  cursor: pointer;',
    '  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;',
    '}',
    '.filter-btn:hover { border-color: var(--blue); color: var(--blue); }',
    '.filter-btn.active { background: var(--blue); color: #fff; border-color: var(--blue); }',
    '.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }',
  ].join('\n');
  document.head.appendChild(style);
})();
