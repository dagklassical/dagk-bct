// hardhat.config.cjs
require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");
// require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  
  // ✅ API Key unificada de Etherscan (funciona para Polygon Amoy)
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.ETHERSCAN_API_KEY  // ← Usa el nombre que tienes en .env
    }
  },
  
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};