/**
 * ============================================================
 * KLEVER MEDIA — Insights Posts Data
 * ============================================================
 *
 * Same pattern as posts-data.js (Work). Data lives in
 * /content/insights.json — hand-edited for now, not CMS-managed.
 * ============================================================
 */

(function () {
  fetch('/content/insights.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      window.INSIGHTS = Array.isArray(data.posts) ? data.posts : [];
    })
    .catch(function () {
      window.INSIGHTS = [];
    })
    .finally(function () {
      document.dispatchEvent(new CustomEvent('insights-ready'));
    });
})();
