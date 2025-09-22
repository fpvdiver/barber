export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://barber-lovat-eight.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const r = await fetch('https://primary-jow9-barber.up.railway.app/webhook/user/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body || {}),
  });

  const text = await r.text();
  res.status(r.status).send(text);
}
