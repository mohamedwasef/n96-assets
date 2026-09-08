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

    /* الهيرو والبار تحت العنوان: نفس .container الأصلي بتاع الموقع تمامًا

       (زي الناف والمحتوى والفوتر) عشان يفضلوا متسقين معاهم في كل العروض. */

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

    /* الاستثناء الوحيد: شريط فوق الفوتر بعرض كامل.

       n96-footspacer: عنصر شفاف فاضي في فلو الصفحة الطبيعي، بنفس ارتفاع

       الشريط — وظيفته إنه "يحجز" المساحة فيدفع الفوتر (absolute) لتحت

       بالقد ده، فمفيش أي تراكب مع محتوى الصفحة فوقه.

       n96-footbar: الشريط الظاهر نفسه — child جوه الفوتر بالظبط وبـ

       bottom:100% عشان يترسم بالظبط في المساحة اللي حجزها الـ spacer،

       ملاصق لأعلى الفوتر بدون أي فجوة. */

    '.n96-footspacer{display:block;width:100%;line-height:0;aspect-ratio:1440/56;pointer-events:none}',

    '.n96-footbar{position:absolute;left:0;right:0;bottom:100%;width:100%;aspect-ratio:1440/56;line-height:0;overflow:hidden;pointer-events:none;margin:0;padding:0}',

    '.n96-footbar img{display:block;width:100%;height:100%;object-fit:cover}',

    /* الفوتر: فليكس — مساحة أمان ثابتة يسار الشاشة (عشان زرار الرجوع لأعلى

       الـ fixed اللي بيقعد شمال الشاشة) في كل الـ breakpoints */

    '.page-footer .container.n96-flex{display:flex;align-items:center;justify-content:space-between;flex-direction:row-reverse;flex-wrap:wrap;gap:10px 16px;padding-left:72px}',

    '.page-footer .container.n96-flex>span{float:none!important;width:auto!important;display:block;line-height:18px}',

    '.n96-footlogo{display:block;height:34px;width:auto;flex:0 0 auto;order:-1;margin-inline-start:8px}',

    /* تابلت وموبايل: توسيط مع الحفاظ على مساحة الأمان */

    '@media (max-width:768px){',

      '.n96-hero img{aspect-ratio:1720/2595}',

      '.n96-bar{height:16px}',

      '.page-content>.container::before{background-size:cover}',

      '.page-footer .container.n96-flex{justify-content:center;text-align:center;padding-left:72px;gap:6px 14px}',

      '.page-footer .container.n96-flex>span:last-child{width:100%!important;font-size:11px}',

      '.n96-footlogo{height:26px}',

    '}',

    /* موبايل صغير جدًا */

    '@media (max-width:420px){',

      '.page-footer .container.n96-flex{padding-left:56px;padding-top:6px}',

      '.n96-footlogo{height:22px}',

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

  function apply() {

    /* شيل أي نسخة سابقة */

    var old = document.querySelectorAll('.n96');

    for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);

    var oldFc = document.querySelector('.page-footer .container.n96-flex');

    if (oldFc) oldFc.classList.remove('n96-flex');

    var style = document.getElementById('n96-style-tag');

    if (!style) {

      style = el('style', 'n96-style');

      style.id = 'n96-style-tag';

      document.head.appendChild(style);

    }

    style.textContent = CSS;

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

      /* 1) اسبيسر شفاف في الفلو الطبيعي يحجز المساحة ويدفع الفوتر تحت */

      var spacer = el('div', 'n96-footspacer');

      var beforeFooter = footer.previousElementSibling;

      if (beforeFooter) beforeFooter.appendChild(spacer);

      else footer.parentNode.insertBefore(spacer, footer);

      /* 2) الشريط الظاهر — جوه الفوتر بالظبط، ملاصق لأعلاه */

      var fb = el('div', 'n96-footbar', '<img src="' + A.aboveFooter + '" alt="">');

      footer.insertBefore(fb, footer.firstChild);

      var fc = footer.querySelector('.container') || footer;

      fc.classList.add('n96-flex');

      var flogo = el('img', 'n96-footlogo');

      flogo.src = A.logo;

      flogo.alt = 'اليوم الوطني السعودي 96';

      fc.appendChild(flogo);

    }

  }

  if (document.readyState === 'loading') {

    document.addEventListener('DOMContentLoaded', apply);

  } else {

    apply();

  }

})(); 
