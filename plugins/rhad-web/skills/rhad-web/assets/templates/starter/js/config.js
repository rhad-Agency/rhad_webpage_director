// Configuration the owner supplies. Empty by default: the page never fakes a submission.
window.RHAD_CONFIG = {
  endpoint: '',          // same-origin lead endpoint (POST JSON). Required before launch.
  privacyUrl: '',        // real privacy policy URL. Required before launch.
  source: 'rhad-web-starter',
  analytics: null        // optional: function (eventName, props) {}. Never pass names, emails, phone numbers or free text.
};
