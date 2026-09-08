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
    aboveFooter: B + 'n96_above_footer_bar.svg'      // 1440 x 86
  };
  var CSS = [
    '.n96,.n96 *{box-sizing:border-box}',
    'html,body{overflow-x:hidden}',
    /* السلايدر — بعرض الـ container، ارتفاع طبيعي حسب نسبة الصورة */
    '.n96-wrap{line-height:0}',
    '.n96-hero{position:relative;width:100%;line-height:0;background:#7a5a1e;overflow:hidden}',
    '.n96-hero picture,.n96-hero img{display:block;width:100%;height:auto}',
    '.n96-hero img{aspect-ratio:5760/1964}',
    /* شريط زخرفي تحت عنوان الصفحة — خلفية متكررة أفقياً بارتفاع ثابت */
    '.n96-bar{display:block;width:100%;height:20px;line-height:0;' +
      'background:url(' + A.underAbout + ') center/auto 100% repeat-x}',
    /* خلفية زخرفية خفيفة ورا المحتوى */
    '.page-content>.container{position:relative;min-height:55vh}',
    '.page-content>.container::before{content:"";display:block;position:absolute;left:15px;right:15px;top:0;bottom:0;width:auto;height:auto;opacity:.32;pointer-events:none;' +
      'background:url(' + A.newsBg + ') center top/100% auto no-repeat}',
    '.page-content>.container>*{position:relative;z-index:1}',
    /* شريط فوق الفوتر — عرض كامل، ملاصق للفوتر بدون أي فراغ (1440x86 → المعروض: 1440/56) */
    '.page-footer.navbar-fixed-bottom{overflow:visible}',
    '.n96-footbar{position:absolute;left:0;right:0;bottom:100%;width:100%;aspect-ratio:1440/56;line-height:0;overflow:hidden;pointer-events:none;margin-bottom:0}',
    '.n96-footbar img{display:block;position:absolute;left:0;bottom:0;width:100%;height:auto}',
    /* الفوتر: فليكس — الحقوق يمين، الروابط في النص، اللوجو أقصى الشمال */
    '.page-footer .container.n96-flex{display:flex;align-items:center;justify-content:space-between;flex-direction:row-reverse;gap:16px}',
    '.page-footer .container.n96-flex>span{float:none!important;width:auto!important;display:block;line-height:18px}',
    '.n96-footlogo{display:block;height:34px;width:auto;flex:0 0 auto;order:-1}',
    /* تابلت: ابعد عن زرار الرجوع لأعلى */
    '@media (max-width:991px){.page-footer .container.n96-flex{padding-left:64px}}',
    /* موبايل */
    '@media (max-width:768px){',
      '.n96-wrap.container{width:100%!important;max-width:none!important;padding:0!important;margin:0!important}',
      '.n96-hero img{aspect-ratio:1720/2595}',
      '.n96-bar{height:16px}',
      '.page-content>.container::before{background-size:cover}',
      '.page-footer .container.n96-flex{flex-wrap:wrap;justify-content:center;text-align:center;padding-left:60px;gap:6px 14px}',
      '.page-footer .container.n96-flex>span:last-child{width:100%!important;font-size:11px}',
      '.n96-footlogo{height:26px}',
    '}',
    /* طباعة: اخفي كل الزخارف */
    '@media print{.n96,.page-content>.container::before{display:none!important}}'
  ].join('\n');
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    e.className = 'n96 ' + cls;
    if (html) e.innerHTML = html;
    return e;
  }
  /* بما إن الفوتر navbar-fixed-bottom (ثابت أسفل الشاشة)، والشريط بيتحط فوقه بـ
   * position:absolute (عشان الأصل ميتغيرش ارتفاعه الحقيقي)، فلازم نضيف مساحة فاضية
   * أسفل الصفحة تساوي ارتفاع الشريط الفعلي (اللي بيتغير مع عرض الشاشة عشان هو
   * aspect-ratio) عشان آخر المحتوى/الـ CTAs ما يتغطوش وهو بيتقرأ تحت الشريط. */
  function restoreBodyPad() {
    if (document.body.hasAttribute('data-n96-orig-pb')) {
      document.body.style.paddingBottom = document.body.getAttribute('data-n96-orig-pb');
    }
  }
  function sizeFootbar() {
    var fb = document.querySelector('.n96-footbar');
    if (!fb) return;
    if (!document.body.hasAttribute('data-n96-orig-pb')) {
      document.body.setAttribute('data-n96-orig-pb', getComputedStyle(document.body).paddingBottom || '0px');
    }
    var orig = parseFloat(document.body.getAttribute('data-n96-orig-pb')) || 0;
    var h = fb.getBoundingClientRect().height;
    document.body.style.setProperty('padding-bottom', Math.ceil(orig + h) + 'px', 'important');
  }
  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sizeFootbar, 120);
  }
  function apply() {
    /* استرجع الـ padding الأصلي الأول عشان ما يتراكمش لو الفنكشن اتنفذت أكتر من مرة */
    restoreBodyPad();
    /* شيل أي نسخة سابقة */
    var old = document.querySelectorAll('.n96');
    for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);
    var oldFc = document.querySelector('.page-footer .container.n96-flex');
    if (oldFc) oldFc.classList.remove('n96-flex');
    window.removeEventListener('resize', onResize);
    var style = el('style', 'n96-style');
    style.textContent = CSS;
    document.head.appendChild(style);
    var header   = document.querySelector('.page-header');
    var pageHead = document.querySelector('.page-head');
    var footer   = document.querySelector('.page-footer');
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
      var bar = el('div', 'n96-wrap container', '<div class="n96-bar" role="presentation"></div>');
      pageHead.parentNode.insertBefore(bar, pageHead.nextSibling);
    }
    if (footer) {
      var fc = footer.querySelector('.container') || footer;
      var fb = el('div', 'n96-footbar', '<img src="' + A.aboveFooter + '" alt="">');
      footer.insertBefore(fb, footer.firstChild);
      fc.classList.add('n96-flex');
      var flogo = el('img', 'n96-footlogo');
      flogo.src = A.logo;
      flogo.alt = 'اليوم الوطني السعودي 96';
      fc.appendChild(flogo);
      /* اضبط مساحة الصفحة تحت بعد ما الشريط يتحط في الـ DOM */
      sizeFootbar();
      window.addEventListener('resize', onResize);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
