// Contact Form — Resend API via Netlify serverless function
// API key is NEVER in frontend code. It lives in RESEND_API_KEY environment variable on Netlify.
(function() {
  const form        = document.getElementById('contact-form');
  const feedback    = document.getElementById('form-feedback');
  const submitBtn   = document.getElementById('form-submit');
  const submitText  = document.getElementById('submit-text');
  const submitLoader = document.getElementById('submit-loader');

  if (!form) return;

  function setLoading(on) {
    submitBtn.disabled         = on;
    submitText.style.display   = on ? 'none' : '';
    submitLoader.style.display = on ? ''     : 'none';
  }

  function showFeedback(msg, type) {
    feedback.textContent   = msg;
    feedback.className     = `form-feedback ${type}`;
    feedback.style.display = 'block';
  }

  function validate(data) {
    if (!data.name.trim())    return 'Please enter your name.';
    if (!data.email.trim())   return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Please enter a valid email address.';
    if (!data.subject.trim()) return 'Please enter a subject.';
    if (!data.message.trim() || data.message.trim().length < 10) return 'Please enter a message (min 10 characters).';
    return null;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.style.display = 'none';

    const data = {
      name:    form.querySelector('#f-name').value,
      email:   form.querySelector('#f-email').value,
      subject: form.querySelector('#f-subject').value,
      message: form.querySelector('#f-message').value,
    };

    const validationError = validate(data);
    if (validationError) { showFeedback(validationError, 'error'); return; }

    setLoading(true);

    // Running locally via file:// — serverless functions not available
    if (window.location.protocol === 'file:') {
      setTimeout(() => {
        setLoading(false);
        showFeedback(
          '⚠️ Live email delivery requires deployment to Netlify. Set RESEND_API_KEY as an environment variable. Meanwhile, email me directly at yvashishtha04@gmail.com',
          'error'
        );
      }, 500);
      return;
    }

    // Call Netlify function (deployed environment)
    try {
      const res  = await fetch('/.netlify/functions/send-email', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data)
      });
      const json = await res.json();

      if (res.ok && json.success) {
        showFeedback("✅ Message sent! I'll get back to you soon.", 'success');
        form.reset();
      } else {
        showFeedback(`❌ ${json.error || 'Failed to send. Please email yvashishtha04@gmail.com directly.'}`, 'error');
      }
    } catch {
      showFeedback('❌ Network error. Please email me directly at yvashishtha04@gmail.com', 'error');
    } finally {
      setLoading(false);
    }
  });
})();
