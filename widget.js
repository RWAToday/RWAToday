/*!
 * RWAToday.news Feed Widget v1.0
 * Embed real-time RWA news on any site.
 * Usage: <div id="rwatoday-feed"></div>
 *        <script src="https://rwatoday.news/widget.js"></script>
 *
 * Options (set on the div as data- attributes):
 *   data-count="5"          — number of articles (1-20, default 5)
 *   data-category="Markets" — filter by category keyword (optional)
 *   data-theme="dark"       — "dark" or "light" (default: dark)
 *   data-title="false"      — hide the RWAToday header (default: show)
 *
 * Example:
 *   <div id="rwatoday-feed" data-count="3" data-theme="light"></div>
 *   <script src="https://rwatoday.news/widget.js" async></script>
 */
(function() {
  'use strict';

  var FEED_URL = 'https://rwatoday.news/feed.json';
  var SITE_URL = 'https://rwatoday.news';

  var DARK = {
    bg: '#0D1810', border: '#1E3020', card: '#112418',
    title: '#F0F4FA', cat: '#3DAA6E', excerpt: '#A8C4B0',
    date: '#5A8068', link: '#3DAA6E', header: '#3DAA6E',
    cardBorder: '#265235'
  };
  var LIGHT = {
    bg: '#F8FAF8', border: '#C8DCC8', card: '#FFFFFF',
    title: '#0D1810', cat: '#2A8A50', excerpt: '#3A5A40',
    date: '#6A9070', link: '#2A8A50', header: '#2A8A50',
    cardBorder: '#C8DCC8'
  };

  function init() {
    var containers = document.querySelectorAll('#rwatoday-feed, [data-rwatoday-feed]');
    if (!containers.length) return;

    containers.forEach(function(el) {
      var count    = Math.min(parseInt(el.dataset.count    || '5', 10), 20);
      var filter   = (el.dataset.category || '').toLowerCase();
      var theme    = el.dataset.theme === 'light' ? LIGHT : DARK;
      var showHdr  = el.dataset.title !== 'false';

      el.style.cssText = 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;';

      fetch(FEED_URL)
        .then(function(r){ return r.json(); })
        .then(function(data) {
          var items = data.items || [];
          if (filter) {
            items = items.filter(function(i) {
              return (i._rwatoday && i._rwatoday.category && i._rwatoday.category.toLowerCase().includes(filter))
                  || (i.tags && i.tags.join(' ').toLowerCase().includes(filter));
            });
          }
          items = items.slice(0, count);

          var html = '<div style="background:' + theme.bg + ';border:1px solid ' + theme.border + ';border-radius:8px;overflow:hidden;">';
          if (showHdr) {
            html += '<div style="padding:14px 18px;border-bottom:1px solid ' + theme.border + ';display:flex;align-items:center;justify-content:space-between;">'
                  + '<a href="' + SITE_URL + '" target="_blank" rel="noopener" style="text-decoration:none;font-size:15px;font-weight:700;color:' + theme.header + ';letter-spacing:0.5px;">RWAToday.news</a>'
                  + '<span style="font-size:11px;color:' + theme.date + ';font-weight:500;">RWA News Feed</span>'
                  + '</div>';
          }

          items.forEach(function(item, idx) {
            var cat = (item._rwatoday && item._rwatoday.category) || (item.tags && item.tags[0]) || '';
            var date = (item._rwatoday && item._rwatoday.date_display) || '';
            var isLast = idx === items.length - 1;
            html += '<a href="' + item.url + '" target="_blank" rel="noopener" '
                  + 'style="display:block;padding:14px 18px;text-decoration:none;background:' + theme.card + ';'
                  + (isLast ? '' : 'border-bottom:1px solid ' + theme.cardBorder + ';') + '">'
                  + '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:' + theme.cat + ';margin-bottom:5px;">' + esc(cat) + '</div>'
                  + '<div style="font-size:14px;font-weight:700;color:' + theme.title + ';line-height:1.35;margin-bottom:5px;">' + esc(item.title) + '</div>'
                  + '<div style="font-size:12px;color:' + theme.date + ';">' + esc(date) + '</div>'
                  + '</a>';
          });

          html += '<div style="padding:10px 18px;background:' + theme.bg + ';text-align:center;">'
                + '<a href="' + SITE_URL + '" target="_blank" rel="noopener" '
                + 'style="font-size:11px;color:' + theme.link + ';text-decoration:none;font-weight:600;">View all articles at RWAToday.news →</a>'
                + '</div></div>';

          el.innerHTML = html;
        })
        .catch(function(e) {
          el.innerHTML = '<div style="padding:16px;color:#5A8068;font-size:13px;">RWAToday feed unavailable. <a href="' + SITE_URL + '" style="color:#3DAA6E;">Visit RWAToday.news</a></div>';
        });
    });
  }

  function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
