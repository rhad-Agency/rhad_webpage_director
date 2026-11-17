/* Enhancements only. The page works with this script blocked: content and the form are in the HTML. */
(function () {
  'use strict';
  var cfg = window.RHAD_CONFIG || {};
  var track = function (name, props) { try { if (typeof cfg.analytics === 'function') cfg.analytics(name, props || {}); } catch (e) { /* analytics must never break the page */ } };

  // Mobile menu: disclosure with aria-expanded, Escape closes and returns focus, closes on navigation.
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('site-nav');
  if (btn && nav) {
    var setOpen = function (open, returnFocus) {
      nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open));
      if (!open && returnFocus) btn.focus();
    };
    btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') setOpen(false, true); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  }

  // Privacy link must be real.
  var priv = document.getElementById('privacy-link');
  if (priv && cfg.privacyUrl) priv.setAttribute('href', cfg.privacyUrl);

  // Form: client validation, real endpoint, no fake success.
  var form = document.getElementById('enquiry-form'), status = document.getElementById('form-status');
  if (!form) return;
  var fields = { name: 'Enter your name.', email: 'Enter an email like name@company.com.', company: 'Enter your company.' };
  var started = false;
  form.addEventListener('input', function (e) { if (!started) { started = true; track('review_form_start'); } var n = e.target && e.target.name; if (n && fields[n]) showError(n, ''); });

  function showError(name, msg) {
    var input = form.elements[name], err = document.getElementById('f-' + name + '-err'); if (!input || !err) return;
    err.textContent = msg; err.hidden = !msg; input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function validate() {
    var first = null;
    Object.keys(fields).forEach(function (n) {
      var el = form.elements[n], v = (el.value || '').trim(), bad = !v || (n === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      showError(n, bad ? fields[n] : ''); if (bad && !first) first = el;
    });
    return first;
  }
  var btnSubmit = form.querySelector('button[type="submit"]'), label = btnSubmit ? btnSubmit.textContent : '';
  form.addEventListener('submit', function (e) {
    e.preventDefault(); status.textContent = '';
    var bad = validate(); if (bad) { bad.focus(); status.textContent = 'Please fix the highlighted fields.'; track('review_form_error', { type: 'validation' }); return; }
    if (!cfg.endpoint) { status.textContent = 'This form is not connected yet, so nothing was sent. Your answers are still here.'; track('review_form_error', { type: 'not_configured' }); return; }
    var data = { name: form.elements.name.value.trim(), email: form.elements.email.value.trim(), company: form.elements.company.value.trim(), phone: form.elements.phone.value.trim(), context: form.elements.context.value.trim(), source: cfg.source || '', page: location.href };
    btnSubmit.disabled = true; btnSubmit.textContent = 'Sending...'; form.setAttribute('aria-busy', 'true');
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null, timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 15000) : null;
    fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (res.ok && res.body && res.body.accepted === true) { status.textContent = 'Received. We will reply to the email you gave to arrange a time. Sending this form does not book a slot yet.'; form.reset(); track('review_request_accepted'); }
        else throw new Error('not accepted');
      })
      .catch(function () { status.textContent = 'We could not send this. Your answers are still here. Try again, or contact us directly.'; track('review_form_error', { type: 'network_or_server' }); })
      .then(function () { if (timer) clearTimeout(timer); btnSubmit.disabled = false; btnSubmit.textContent = label; form.removeAttribute('aria-busy'); });
  });
})();
