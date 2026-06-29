// Netlify Function — Send email via Resend API
// RESEND_API_KEY must be set as a Netlify environment variable (never in code)
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Email service not configured' }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) }; }

  const { name, email, subject, message } = body;
  if (!name || !email || !subject || !message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'All fields are required' }) };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email address' }) };
  }

  const htmlBody = `
<!DOCTYPE html>
<html>
<body style="font-family:Inter,sans-serif;background:#020408;color:#eef4ff;padding:40px;max-width:600px;margin:0 auto">
  <div style="border:1px solid rgba(0,180,255,0.2);border-radius:14px;padding:32px;background:#0b1421">
    <div style="font-size:11px;letter-spacing:3px;color:#00b4ff;text-transform:uppercase;margin-bottom:24px">Portfolio Contact Form</div>
    <h2 style="font-size:22px;margin-bottom:24px;color:#eef4ff">${subject}</h2>
    <table style="width:100%;margin-bottom:24px">
      <tr><td style="color:#8ab2cc;font-size:13px;padding:8px 0;width:80px">From</td><td style="color:#eef4ff;font-weight:600">${name}</td></tr>
      <tr><td style="color:#8ab2cc;font-size:13px;padding:8px 0">Email</td><td><a href="mailto:${email}" style="color:#00b4ff">${email}</a></td></tr>
    </table>
    <div style="background:#050a12;border-radius:10px;padding:20px;border-left:3px solid #00b4ff;margin-bottom:24px">
      <p style="color:#eef4ff;line-height:1.7;margin:0;white-space:pre-wrap">${message.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>
    </div>
    <p style="color:#3d5a72;font-size:11px;text-align:center">Sent from yavkrit.portfolio via Portfolio Contact Form</p>
  </div>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: ['yvashishtha04@gmail.com'],
        reply_to: email,
        subject: `[Portfolio] ${subject} — from ${name}`,
        html: htmlBody
      })
    });

    if (!res.ok) {
      const err = await res.json();
      return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Failed to send' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Network error' }) };
  }
};
