// scripts/deploy.js
async function main() {
  // Obtener el firmante (tu wallet)
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Desplegando con la cuenta:", deployer.address);
  
  // ✅ FIX: Usar ethers.provider.getBalance() en lugar de deployer.getBalance()
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Saldo de la cuenta:", ethers.formatEther(balance), "POL");

  // Obtener el contrato compilado
  const MusicCard = await ethers.getContractFactory("MusicCard");
  
  // Desplegar
  console.log("📦 Desplegando MusicCard...");
  const musicCard = await MusicCard.deploy();
  await musicCard.waitForDeployment();
  
  // Resultados
  const address = await musicCard.getAddress();
  console.log("✅ MusicCard desplegado en:", address);
  console.log("🔗 Ver en Polygonscan: https://amoy.polygonscan.com/address/" + address);
}

// Ejecutar y manejar errores
main().catch((error) => {
  console.error("❌ Error en deploy:", error);
  process.exitCode = 1;
});