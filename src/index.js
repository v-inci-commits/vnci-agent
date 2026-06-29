const express = require('express');
const app = express();
app.use(express.json());

const SHOP = 'cmuabp-uy.myshopify.com';
const CLIENT_ID = '98a74931d4b786909107819036e1e527';
const CLIENT_SECRET = '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';

let accessToken = null;

async function getToken() {
  if (accessToken) return accessToken;
  const fetch = (await import('node-fetch')).default;
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' }),
  });
  const data = await res.json();
  accessToken = data.access_token;
  return accessToken;
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.all('/shopify/*', async (req, res) => {
  try {
    const token = await getToken();
    const path = req.params[0];
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`https://${SHOP}/admin/api/2024-01/${path}`, {
      method: req.method,
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: ['GET','HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => res.json({ status: 'V-nci Agent Online' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT));
