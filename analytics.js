(function () {
  // Google Analytics 4. Guarded by hostname so local previews and any fork of this
  // repo stay out of the reports — only real visits to swimandcolor.com are counted.
  var GA_ID = 'G-P9ZLXRYSR8';

  var host = location.hostname;
  if (host !== 'swimandcolor.com' && host !== 'www.swimandcolor.com') return;

  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(tag);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID);
})();
