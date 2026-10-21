'use strict';
(() => {
  const $ = (selector) => document.querySelector(selector);
  const year = $('#year'); if (year) year.textContent = String(new Date().getFullYear());
  const progress = $('#scrollLine');
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.max(0,Math.min(1,window.scrollY/max)) : 0})`;
  };
  window.addEventListener('scroll', updateScroll, { passive: true }); updateScroll();
  const toggle = $('#menuToggle'), mobileNav = $('#mobileNav');
  const setMenu = (open) => { if (!toggle || !mobileNav) return; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة'); mobileNav.hidden = !open; document.body.classList.toggle('menu-open',open); };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 1030) setMenu(false); });
  const checkout = $('#checkoutDialog');
  $('#openCheckout')?.addEventListener('click', () => checkout?.showModal());
  $('#openCheckoutMobile')?.addEventListener('click', () => { setMenu(false); checkout?.showModal(); });
  $('#closeCheckout')?.addEventListener('click', () => checkout?.close());
  checkout?.addEventListener('click', event => { if (event.target === checkout) checkout.close(); });
  const wallet = '01023368635';
  $('#copyWallet')?.addEventListener('click', async () => {
    const status = $('#copyStatus');
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(wallet);
      else { const field = $('#walletNumber'); const range = document.createRange(); range.selectNodeContents(field); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); const success = document.execCommand('copy'); selection.removeAllRanges(); if (!success) throw Error('copy unavailable'); }
      if (status) status.textContent = 'تم نسخ رقم المحفظة.';
    } catch { if (status) status.textContent = 'تقدر تنسخ الرقم يدويًا من المربع.'; }
  });
  const normalizePhone = (value) => value.replace(/[\s\-()]/g,'');
  $('#checkoutForm')?.addEventListener('submit', event => {
    event.preventDefault(); const form = event.currentTarget;
    const name = $('#buyerName').value.trim(), email = $('#buyerEmail').value.trim();
    const phone = normalizePhone($('#buyerPhone').value), sender = normalizePhone($('#senderPhone').value);
    $('#buyerPhone').value = phone; $('#senderPhone').value = sender;
    if (!form.reportValidity()) return;
    const message = [
      'أهلًا KORSUP 👋',
      'حابب أطلب الوصول الدائم لمكتبة KORSUP (499 جنيه).',
      '',
      `الاسم: ${name}`,
      `إيميل Google: ${email}`,
      `واتساب العميل: ${phone}`,
      `رقم المحفظة المحوّل منها: ${sender}`,
      '',
      'هرفق صورة إثبات التحويل في المحادثة علشان تراجعوا الطلب.',
      'عارف إن تفعيل الوصول بيكون بعد تأكيد استلام التحويل.'
    ].join('\n');
    const url = `https://wa.me/201017130477?text=${encodeURIComponent(message)}`;
    // Same-tab navigation is reliable on mobile browsers and is never treated as an order confirmation.
    window.location.assign(url);
  });
  const videoDialog = $('#videoDialog'), video = $('#previewVideo'), videoTitle = $('#videoTitle');
  document.querySelectorAll('.video-play[data-video]').forEach(button => button.addEventListener('click', () => {
    const src = button.getAttribute('data-video');
    if (!src || !/^assets\/[a-z0-9-]+\.mp4$/.test(src)) return;
    video.pause(); video.removeAttribute('src'); video.load();
    video.src = src; video.poster = button.querySelector('img')?.getAttribute('src') || '';
    videoTitle.textContent = button.getAttribute('data-title') || 'معاينة الفيديو';
    videoDialog.showModal();
    video.play().catch(() => {});
  }));
  const closeVideo = () => { video.pause(); video.removeAttribute('src'); video.load(); videoDialog.close(); };
  $('#closeVideo')?.addEventListener('click', closeVideo);
  videoDialog?.addEventListener('click', event => { if (event.target === videoDialog) closeVideo(); });
  videoDialog?.addEventListener('close', () => { video.pause(); video.removeAttribute('src'); video.load(); });
})();
