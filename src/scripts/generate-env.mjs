// scripts/generate-env.mjs
import fs from 'fs';
import { fileURLToPath } from 'url';

async function fetchAndSaveEnv() {
  let matic = '0.84';
  let usdc = '1.00';
  let total = '0';

  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network,usd-coin&vs_currencies=usd');
    const data = await res.json();
    matic = (data['matic-network']?.usd || 0.84).toFixed(2);
    usdc = (data['usd-coin']?.usd || 1.00).toFixed(2);
    total = '142'; // ← reemplaza con tu API cuando esté lista
  } catch (e) {
    console.warn('⚠️ Usando valores por defecto');
  }

  const envContent = [
    `MATIC_PRICE=${matic}`,
    `USDC_PRICE=${usdc}`,
    `TOTAL_CERTIFICADOS=${total}`,
    `BUILD_TIME=${new Date().toISOString()}`
  ].join('\n');

  const __dirname = fileURLToPath(new URL('.', import.meta.url));
  fs.writeFileSync(`${__dirname}/../.env.local`, envContent);
  console.log('✅ .env.local generado');
}

fetchAndSaveEnv();