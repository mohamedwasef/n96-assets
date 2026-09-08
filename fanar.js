/*
 * n96.js — الهوية البصرية لليوم الوطني 96 على بوابة فنار (MOFA Services)
 * يُضاف كملف واحد فقط:  <script src="n96.js" defer></script>
 * أو يُلصق كاملاً في الكونسول. آمن للتكرار: يشيل أي نسخة قديمة قبل ما يضيف.
 */
(function () {
  'use strict';

  var B = 'https://cdn.jsdelivr.net/gh/mohamedwasef/n96-assets@main/';
  var A = {
    logo:        B + 'n96_logo.svg',                 // 106 x 42
    slider:      B + 'n96_slider.jpg',               // 5760 x 1964
    sliderMob:   B + 'n96_slider_mobile.jpg',        // 1720 x 2595
    newsBg:      B + 'n96_news_bg.svg',              // 1440 x 678
    underAbout:  B + 'n96_under_about_bar.svg',      // 1440 x 29
    aboveFooter: B + 'n96_above_footer_bar.svg'      // 1440 x 36
  };

  /* كل الشرايط والصور جوه نفس الـ container بتاع الصفحة (نفس عرض المحتوى) والارتفاع بيتحسب من نسبة الأصل
     عشان التصميم ميتقصّش ولا يتكرر (الشرايط كصور img مش background عشان تتقاس صح). */
  var CSS = [
    '.n96,.n96 *{box-sizing:border-box}',
    'html,body{overflow-x:hidden}',

    /* السلايدر — بعرض الـ container، ارتفاع طبيعي حسب نسبة الصورة */
    '.n96-wrap{line-height:0}',
    '.n96-hero{position:relative;width:100%;line-height:0;background:#7a5a1e;overflow:hidden}',
    '.n96-hero picture,.n96-hero img{display:block;width:100%;height:auto}',
    '.n96-hero img{aspect-ratio:5760/1964}',

    /* شريط زخرفي تحت عنوان الصفحة — جوه الـ container */
    '.n96-bar{display:block;width:100%;line-height:0}',
    '.n96-bar img{display:block;width:100%;height:auto}',

    /* خلفية زخرفية خفيفة ورا المحتوى */
    '.page-content>.container{position:relative;min-height:55vh}',
    '.page-content>.container::before{content:"";display:block;position:absolute;left:15px;right:15px;top:0;bottom:0;width:auto;height:auto;opacity:.32;pointer-events:none;',
      'background:url(' + A.newsBg + ') center top/100% auto no-repeat}',
    '.page-content>.container>*{position:relative;z-index:1}',

    /* شريط فوق الفوتر — عرض كامل (الفوتر ثابت أسفل الشاشة) */
    '.page-footer.navbar-fixed-bottom{overflow:visible}',
    '.n96-footbar{position:absolute;left:0;right:0;bottom:100%;width:100%;line-height:0;pointer-events:none}',
    '.n96-footbar img{display:block;width:100%;height:auto}',

    /* اللوجو في الفوتر على الشمال */
    '.page-footer .container{position:relative}',
    '.n96-footlogo{position:absolute;left:0;top:50%;transform:translateY(-50%);height:34px;width:auto;z-index:2}',

    /* تابلت: ابعد عن زرار الرجوع لأعلى */
    '@media (max-width:991px){.n96-footlogo{left:60px}}',

    /* موبايل */
    '@media (max-width:768px){',
      '.n96-footlogo{position:static;transform:none;display:block;height:30px;margin:0 auto 8px 0}',
      '.n96-hero img{aspect-ratio:1720/2595}',
      '.page-content>.container::before{background-size:cover}',
    '}'
  ].join('\n');

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    e.className = 'n96 ' + cls;
    if (html) e.innerHTML = html;
    return e;
  }

  function apply() {
    /* شيل أي نسخة سابقة */
    var old = document.querySelectorAll('.n96');
    for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);

    var style = el('style', 'n96-style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var header    = document.querySelector('.page-header');
    var pageHead  = document.querySelector('.page-head');
    var footer    = document.querySelector('.page-footer');

    if (header) {
      var hero = el('div', 'n96-hero',
        '<picture>' +
          '<source media="(max-width:768px)" srcset="' + A.sliderMob + '">' +
          '<img src="' + A.slider + '" alt="عزّنا بطبعنا">' +
        '</picture>');
      var wrap = el('div', 'n96-wrap container');
      wrap.appendChild(hero);
      header.parentNode.insertBefore(wrap, header.nextSibling);
    }

    if (pageHead) {
      var bar = el('div', 'n96-wrap container', '<div class="n96-bar"><img src="' + A.underAbout + '" alt=""></div>');
      pageHead.parentNode.insertBefore(bar, pageHead.nextSibling);
    }

    if (footer) {
      var fc = footer.querySelector('.container') || footer;
      var fb = el('div', 'n96-footbar', '<img src="' + A.aboveFooter + '" alt="">');
      footer.insertBefore(fb, footer.firstChild);
      var flogo = el('img', 'n96-footlogo');
      flogo.src = A.logo; flogo.alt = 'اليوم الوطني السعودي 96';
      fc.insertBefore(flogo, fc.firstChild);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
