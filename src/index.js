const express = require('express');
const app = express();
app.use(express.json());

const SHOP = 'cmuabp-uy.myshopify.com';
const TOKEN = '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';
const API = 'https://' + SHOP + '/admin/api/2024-01';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.all('/shopify/*', async (req, res) => {
  try {
    const path = req.params[0];
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(API + '/' + path, {
      method: req.method,
      headers: {
        'X-Shopify-Access-Token': TOKEN,
        'Content-Type': 'application/json',
      },
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
