// src/lib/walletClient.ts
import { createConfig, http } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { injected, rainbowWallet, metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [injected(), metaMaskWallet(), walletConnectWallet(), rainbowWallet()],
    },
  ],
  {
    projectId: 'TU_PROJECT_ID_DE_WALLETCONNECT', // Regístrate en https://cloud.walletconnect.com/
    appName: 'Dag Klassical BCT',
  }
);

export const config = createConfig({
  chains: [polygon],
  connectors,
  transports: {
    [polygon.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}