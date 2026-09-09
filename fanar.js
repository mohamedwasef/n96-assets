/*
 * n96.js
 * Saudi National Day 96 visual identity overlay for the Fanar portal (MOFA Services).
 *
 * Usage: <script src="n96.js" defer></script>
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // Config
  // ---------------------------------------------------------------------

  var ASSET_BASE = 'https://cdn.jsdelivr.net/gh/mohamedwasef/n96-assets@main/';
  var ASSETS = {
    logo: ASSET_BASE + 'n96_logo.svg', // 106 x 42
    slider: ASSET_BASE + 'n96_slider.jpg', // 5760 x 1964
    sliderMobile: ASSET_BASE + 'n96_slider_mobile.jpg', // 1720 x 2595
    newsBg: ASSET_BASE + 'n96_news_bg.svg', // 1440 x 678
    underAbout: ASSET_BASE + 'n96_under_about_bar.svg', // 1440 x 29
    aboveFooter: ASSET_BASE + 'n96_above_footer_bar.svg' // 1440 x 86
  };

  var MOBILE_MAX_WIDTH = 768;
  var TABLET_MAX_WIDTH = 991;
  var FOOTER_BAR_RATIO = 28 / 1440; // visible sliver of the 1440x86 asset, cropped to its bottom edge
  var FOOTER_LOGO_HEIGHT = 34;
  var FOOTER_LOGO_HEIGHT_MOBILE = 26;

  var SCROLL_TOP_SELECTOR =
    '.scroll-to-top, .back-to-top, .scrollup, .scroll-top-btn, [class*="scroll-top" i], [class*="backtotop" i]';

  var STYLE_ID = 'n96-style';
  var INFLOW_ROOT_ID = 'n96-inflow-root'; // marks all in-flow siblings for cleanup
  var FLOAT_ROOT_ID = 'n96-float-root'; // the single floating layer appended to <body>

  // ---------------------------------------------------------------------
  // Small helpers
  // ---------------------------------------------------------------------

  function create(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function image(src, alt) {
    var img = create('img');
    img.src = src;
    img.alt = alt || '';
    return img;
  }

  function hideOnError(container, img) {
    img.addEventListener('error', function () {
      container.style.display = 'none';
    });
  }

  function applyBackgroundImage(container, src) {
    container.style.backgroundImage = 'url("' + src + '")';
    var probe = new Image();
    probe.addEventListener('error', function () {
      container.style.display = 'none';
    });
    probe.src = src;
  }

  function throttleWithRaf(fn) {
    var scheduled = false;
    return function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        fn();
      });
    };
  }

  // ---------------------------------------------------------------------
  // Cleanup (idempotent re-run)
  // ---------------------------------------------------------------------

  function removePreviousInstance() {
    var nodes = document.querySelectorAll(
      '#' + STYLE_ID + ', #' + INFLOW_ROOT_ID + ', .' + INFLOW_ROOT_ID + ', #' + FLOAT_ROOT_ID
    );
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].parentNode.removeChild(nodes[i]);
    }
  }

  // ---------------------------------------------------------------------
  // Styles — every rule below is scoped to our own n96-* classes only.
  // ---------------------------------------------------------------------

  function injectStyles() {
    var style = create('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.n96, .n96 *{box-sizing:border-box}',

      '.n96-hero{line-height:0;overflow:hidden;background:#7a5a1e}',
      '.n96-hero img{display:block;width:100%;height:auto;aspect-ratio:5760/1964}',

      '.n96-title-bar{line-height:0}',
      '.n96-title-bar img{display:block;width:100%;height:auto}',

      '.n96-bg{position:absolute;z-index:-1;opacity:.32;pointer-events:none}',
      '.n96-bg img{display:block;width:100%;height:100%;object-fit:cover;object-position:center top}',

      '.n96-footer-bar{position:fixed;z-index:1031;overflow:hidden;pointer-events:none;' +
        'background-repeat:no-repeat;background-position:left bottom;background-size:100% auto;' +
        '-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;' +
        '-webkit-mask-image:linear-gradient(to left,rgba(0,0,0,1) 0%,rgba(0,0,0,0) 100%);' +
        'mask-image:linear-gradient(to left,rgba(0,0,0,1) 0%,rgba(0,0,0,0) 100%)}',
      '.n96-footer-logo{position:fixed;z-index:1031;pointer-events:none}',
      '.n96-footer-logo img{display:block;width:auto;height:100%}',

      // Mobile: keep the hero and title bar cropped to a taller portrait ratio.
      '@media (max-width:' + MOBILE_MAX_WIDTH + 'px){',
      '.n96-hero img{aspect-ratio:1720/2595}',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  // ---------------------------------------------------------------------
  // In-flow pieces (real siblings — take up real layout space on purpose)
  // ---------------------------------------------------------------------

  function buildHero(header) {
    if (!header) return null;

    var wrap = create('div', 'n96 ' + INFLOW_ROOT_ID + ' container');
    var hero = create('div', 'n96 n96-hero');
    var picture = document.createElement('picture');

    var mobileSource = document.createElement('source');
    mobileSource.media = '(max-width:' + MOBILE_MAX_WIDTH + 'px)';
    mobileSource.srcset = ASSETS.sliderMobile;

    var img = image(ASSETS.slider, 'عزّنا بطبعنا');
    hideOnError(hero, img);

    picture.appendChild(mobileSource);
    picture.appendChild(img);
    hero.appendChild(picture);
    wrap.appendChild(hero);

    header.parentNode.insertBefore(wrap, header.nextSibling);
    return hero;
  }

  function buildTitleBar(pageHead) {
    if (!pageHead) return null;

    var wrap = create('div', 'n96 ' + INFLOW_ROOT_ID + ' container');
    var bar = create('div', 'n96 n96-title-bar');
    var img = image(ASSETS.underAbout);
    hideOnError(bar, img);

    bar.appendChild(img);
    wrap.appendChild(bar);

    pageHead.parentNode.insertBefore(wrap, pageHead.nextSibling);
    return bar;
  }

  // ---------------------------------------------------------------------
  // Floating layer (overlay pieces — never write to real site elements)
  // ---------------------------------------------------------------------

  function buildFloatingLayer(anchors) {
    var root = create('div', 'n96');
    root.id = FLOAT_ROOT_ID;

    var pieces = {};

    if (anchors.contentContainer) {
      var bg = create('div', 'n96 n96-bg');
      var bgImg = image(ASSETS.newsBg);
      hideOnError(bg, bgImg);
      bg.appendChild(bgImg);
      root.appendChild(bg);
      pieces.bg = bg;
    }

    if (anchors.footer) {
      var footerBar = create('div', 'n96 n96-footer-bar');
      applyBackgroundImage(footerBar, ASSETS.aboveFooter);
      root.appendChild(footerBar);
      pieces.footerBar = footerBar;
    }

    if (anchors.footerContainer) {
      var footerLogo = create('div', 'n96 n96-footer-logo');
      var logoImg = image(ASSETS.logo, 'اليوم الوطني السعودي 96');
      hideOnError(footerLogo, logoImg);
      footerLogo.appendChild(logoImg);
      root.appendChild(footerLogo);
      pieces.footerLogo = footerLogo;
    }

    document.body.appendChild(root);
    return pieces;
  }

  // ---------------------------------------------------------------------
  // Positioning engine — reads real element geometry, writes only to our
  // own floating pieces.
  // ---------------------------------------------------------------------

  function positionBg(bg, contentContainer) {
    if (!bg || !contentContainer) return;
    var r = contentContainer.getBoundingClientRect();
    var padding = 15; // matches the container's own side padding
    bg.style.top = r.top + window.scrollY + 'px';
    bg.style.left = r.left + padding + window.scrollX + 'px';
    bg.style.width = Math.max(0, r.width - padding * 2) + 'px';
    bg.style.height = r.height + 'px';
  }

  function positionFooterBar(footerBar, footer) {
    if (!footerBar || !footer) return;
    var r = footer.getBoundingClientRect();
    var height = r.width * FOOTER_BAR_RATIO;
    footerBar.style.left = r.left + 'px';
    footerBar.style.width = r.width + 'px';
    footerBar.style.height = height + 'px';
    footerBar.style.top = r.top - height + 'px';
  }

  function rectsOverlap(a, b, gap) {
    gap = gap || 0;
    return !(
      a.right + gap < b.left ||
      a.left - gap > b.right ||
      a.bottom + gap < b.top ||
      a.top - gap > b.bottom
    );
  }

  function avoidScrollTopButton(footerLogo, height) {
    var btn = document.querySelector(SCROLL_TOP_SELECTOR);
    if (!btn) return;

    var btnRect = btn.getBoundingClientRect();
    var isVisible = btnRect.width > 0 && btnRect.height > 0 && getComputedStyle(btn).visibility !== 'hidden';
    if (!isVisible) return;

    var logoRect = footerLogo.getBoundingClientRect();
    var gap = 6;
    if (rectsOverlap(logoRect, btnRect, gap)) {
      footerLogo.style.top = btnRect.top - height - gap + 'px';
    }
  }

  function positionFooterLogo(footerLogo, footerContainer) {
    if (!footerLogo || !footerContainer) return;
    var r = footerContainer.getBoundingClientRect();
    var isMobile = window.innerWidth <= MOBILE_MAX_WIDTH;
    var isTablet = !isMobile && window.innerWidth <= TABLET_MAX_WIDTH;
    var height = isMobile ? FOOTER_LOGO_HEIGHT_MOBILE : FOOTER_LOGO_HEIGHT;
    var left = r.left + (isTablet ? 60 : 0); // stay clear of the tablet "scroll to top" button

    footerLogo.style.height = height + 'px';
    footerLogo.style.left = left + 'px';
    footerLogo.style.top = r.top + (r.height - height) / 2 + 'px';

    avoidScrollTopButton(footerLogo, height);
  }

  function createPositionAll(pieces, anchors) {
    return function positionAll() {
      positionBg(pieces.bg, anchors.contentContainer);
      positionFooterBar(pieces.footerBar, anchors.footer);
      positionFooterLogo(pieces.footerLogo, anchors.footerContainer);
    };
  }

  function watchLayout(positionAll, anchors) {
    positionAll();

    var scheduled = throttleWithRaf(positionAll);

    window.addEventListener('resize', scheduled);
    window.addEventListener('orientationchange', scheduled);
    window.addEventListener('scroll', scheduled, { passive: true });

    if (window.ResizeObserver) {
      var observer = new ResizeObserver(scheduled);
      [anchors.hero, anchors.titleBar, anchors.contentContainer, anchors.footer, anchors.footerContainer]
        .filter(Boolean)
        .forEach(function (el) {
          observer.observe(el);
        });
    }

    window.addEventListener('load', scheduled);
    setTimeout(positionAll, 300);
  }

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------

  function apply() {
    removePreviousInstance();
    injectStyles();

    var header = document.querySelector('.page-header');
    var pageHead = document.querySelector('.page-head');
    var footer = document.querySelector('.page-footer');
    var footerContainer = footer ? footer.querySelector('.container') : null;
    var contentContainer = document.querySelector('.page-content > .container');

    var hero = buildHero(header);
    var titleBar = buildTitleBar(pageHead);

    var anchors = {
      hero: hero,
      titleBar: titleBar,
      footer: footer,
      footerContainer: footerContainer,
      contentContainer: contentContainer
    };

    var pieces = buildFloatingLayer(anchors);
    var positionAll = createPositionAll(pieces, anchors);
    watchLayout(positionAll, anchors);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
