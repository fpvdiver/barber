export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://barber-lovat-eight.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return res.status(405).json({ ok:false, message:'Method not allowed' });

  const N8N_SIGNUP_URL = process.env.N8N_SIGNUP_URL || 'https://primary-jow9-barber.up.railway.app/webhook/signup';

  try {
    const r = await fetch(N8N_SIGNUP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });

    // tenta repassar o JSON do n8n
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    // propaga status real do n8n
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ ok:false, message: e?.message || 'Proxy error' });
  }
}
