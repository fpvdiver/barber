export default async function handler(req, res) {
  try {
    const N8N_METRICS_URL = process.env.N8N_METRICS_URL; // ex.: https://primary.../webhook/metrics
    if (!N8N_METRICS_URL) return res.status(500).json({ error:true, message:'N8N_METRICS_URL not set' });

    const { days = '30', pro_id = '', location = '' } = req.query;
    const url = new URL(N8N_METRICS_URL);
    url.searchParams.set('days', String(days));
    if (pro_id) url.searchParams.set('pro_id', String(pro_id));
    if (location) url.searchParams.set('location', String(location));

    const r = await fetch(url.toString(), { method: 'GET', headers: { accept: 'application/json' } });
    const text = await r.text();

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error:true, message:e?.message || 'Proxy error' });
  }
}
