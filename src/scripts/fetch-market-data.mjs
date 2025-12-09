// scripts/fetch-market-data.mjs
import { execSync } from 'child_process';

async function fetchMarketData() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network,usd-coin&vs_currencies=usd');
    const data = await res.json();
    const matic = data['matic-network']?.usd?.toFixed(2) || '0.84';
    
    // Aquí podrías consultar tu contrato o una API tuya para total certificados
    const totalCert = '142'; // o dinámico desde tu DB/VPS

    console.log(`MATIC=${matic}`);
    console.log(`TOTAL_CERTIFICADOS=${totalCert}`);
    
    // Exportar como variables de entorno para el build
    process.stdout.write(`export MATIC_PRICE=${matic}\n`);
    process.stdout.write(`export TOTAL_CERTIFICADOS=${totalCert}\n`);
  } catch (e) {
    console.warn('⚠️ Falló fetch de mercado, usando valores por defecto');
    process.stdout.write(`export MATIC_PRICE=0.84\n`);
    process.stdout.write(`export TOTAL_CERTIFICADOS=0\n`);
  }
}

fetchMarketData();