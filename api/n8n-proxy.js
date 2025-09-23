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


import type { VercelRequest, VercelResponse } from '@vercel/node';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!; // ex: https://primary-...railway.app/webhook/metrics

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { days = '30', pro_id = '', location = '' } = req.query;

    const url = new URL(N8N_WEBHOOK_URL);
    url.searchParams.set('days', String(days));
    if (pro_id) url.searchParams.set('pro_id', String(pro_id));
    if (location) url.searchParams.set('location', String(location));

    const r = await fetch(url.toString(), { method: 'GET', headers: { 'accept': 'application/json' } });
    const text = await r.text();

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(r.status).send(text);
  } catch (e: any) {
    res.status(500).json({ error: true, message: e?.message || 'Proxy error' });
  }
}
