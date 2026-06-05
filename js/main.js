/* GameGuide — main.js */
(function () {
  'use strict';

  // ===== 移动端导航 =====
  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
      navToggle.textContent = mainNav.classList.contains('open') ? '?' : '?';
    });

    // 点击外部关闭菜单
    document.addEventListener('click', function (e) {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.textContent = '?';
      }
    });
  }

  // ===== 移动端下拉菜单 =====
  const hasDropdowns = document.querySelectorAll('.has-dropdown > a');
  hasDropdowns.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  // ===== 搜索功能 (简单客户端过滤) =====
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) {
          // 实际项目中跳转到搜索结果页或调用搜索 API
          window.location.href = 'guides/index.html?q=' + encodeURIComponent(q);
        }
      }
    });
  }

  // ===== 滚动时 Header 阴影 =====
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,.5)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  // ===== 文章页：目录高亮 =====
  const tocLinks  = document.querySelectorAll('.article-toc a');
  const headings  = document.querySelectorAll('.article-content h2, .article-content h3');

  if (tocLinks.length && headings.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove('active-toc'); });
          const activeLink = document.querySelector('.article-toc a[href="#' + entry.target.id + '"]');
          if (activeLink) activeLink.classList.add('active-toc');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    headings.forEach(function (h) { if (h.id) observer.observe(h); });
  }

  // ===== 图片懒加载 Fallback =====
  if ('loading' in HTMLImageElement.prototype) {
    // 原生懒加载已支持
  } else {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          obs.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(function (img) { imgObserver.observe(img); });
  }

  // ===== AdSense 初始化 (取消注释后使用) =====
  // if (typeof adsbygoogle !== 'undefined') {
  //   (adsbygoogle = window.adsbygoogle || []).push({});
  // }

  // ===== 阅读进度条 =====
  const articleContent = document.querySelector('.article-content');
  if (articleContent) {
    const bar = document.createElement('div');
    bar.id = 'readProgress';
    bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:#6c63ff;z-index:9999;transition:width .1s;width:0';
    document.body.prepend(bar);

    window.addEventListener('scroll', function () {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

})();
