/**
 * ============================================================
 * KLEVER MEDIA — Work Posts Data
 * ============================================================
 *
 * Posts are managed via the CMS at /admin.
 * Data lives in /content/posts.json — do not edit directly.
 * ============================================================
 */

(function () {
  fetch('/content/posts.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      window.POSTS = Array.isArray(data.posts) ? data.posts : [];
    })
    .catch(function () {
      window.POSTS = [];
    })
    .finally(function () {
      document.dispatchEvent(new CustomEvent('posts-ready'));
    });
})();
