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
      updateHeaderState();
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        updateHeaderState();
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        updateHeaderState();
      }
    });
  }

  /* ── Header: transparent over a dark hero, solid once scrolled ─ */
  const header = document.querySelector('.site-header');
  const hasDarkHero = !!document.querySelector('.hero');

  function updateHeaderState() {
    if (!header) return;
    var menuOpen = menu && menu.classList.contains('open');
    var shouldBeSolid = !hasDarkHero || window.scrollY > 40 || menuOpen;
    header.classList.toggle('site-header--solid', shouldBeSolid);
  }

  if (header) {
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  /* ── Card renderer (shared by Work and Insights) ────────── */
  /**
   * Renders post cards into a container. Same visual pattern is
   * reused for both Work case studies and Insights articles.
   * @param {HTMLElement} container  - The grid element to render into
   * @param {Array}       posts      - Array of post objects
   * @param {number}      limit      - Max cards to show (0 = all)
   * @param {string}      basePath   - Relative path prefix for post links
   * @param {string}      folder     - Subfolder the post lives in ('work/' or 'insights/')
   * @param {string}      linkText   - Card CTA text (defaults to 'View case study')
   */
  function renderWorkCards(container, posts, limit, basePath, folder, linkText) {
    if (!container || !Array.isArray(posts)) return;
    folder = folder || 'work/';
    linkText = linkText || 'View case study';

    var items = limit > 0 ? posts.slice(0, limit) : posts;

    if (items.length === 0) {
      container.innerHTML =
        '<div class="work-empty"><p>No posts yet — check back soon.</p></div>';
      return;
    }

    container.innerHTML = items.map(function (post) {
      var clickable = !!post.postFile;
      var href = clickable ? basePath + folder + post.postFile : '';
      var tag = clickable ? 'a' : 'div';

      var thumbHtml = post.thumb
        ? '<img src="' + post.thumb + '" alt="' + escapeHtml(post.title) + '" loading="lazy" width="600" height="600">'
        : '<div class="work-card__thumb-placeholder" aria-hidden="true">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 80" aria-hidden="true">' +
              '<polyline points="45,8 12,40 45,72" fill="none" stroke="#3d71bd" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
          '</div>';

      return '<' + tag + ' class="work-card"' +
        (clickable ? ' href="' + href + '"' : ' aria-disabled="true"') +
        ' data-category="' + escapeHtml(post.category) + '">' +
        '<div class="work-card__thumb">' + thumbHtml + '</div>' +
        '<div class="work-card__body">' +
          '<p class="work-card__tag">' + escapeHtml(post.category) + '</p>' +
          '<h3>' + escapeHtml(post.title) + '</h3>' +
          '<p>' + escapeHtml(post.excerpt) + '</p>' +
          (clickable ? '<span class="work-card__link">' + linkText + '</span>' : '') +
        '</div>' +
      '</' + tag + '>';
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

  /* ── Work page: full grid ────────────────────────────────── */
  var workGrid = document.getElementById('work-grid');

  if (workGrid) {
    renderWorkCards(workGrid, window.POSTS, 0, '');
  }

  }); // end posts-ready

  /* ── Render insight cards once insights-data.js has fetched ─ */
  document.addEventListener('insights-ready', function () {

  /* ── Home page: insights teaser, if present ──────────────── */
  var insightsTeaserGrid = document.getElementById('insights-teaser-grid');
  if (insightsTeaserGrid) {
    renderWorkCards(insightsTeaserGrid, window.INSIGHTS, 3, '', 'insights/', 'Read the article');
  }

  /* ── Insights page: full grid ────────────────────────────── */
  var insightsGrid = document.getElementById('insights-grid');
  if (insightsGrid) {
    renderWorkCards(insightsGrid, window.INSIGHTS, 0, '', 'insights/', 'Read the article');
  }

  }); // end insights-ready

})();
