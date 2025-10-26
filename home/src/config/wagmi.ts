import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'MockUSDT Bank',
  projectId: 'mockusdt-bank-project',
  chains: [sepolia],
  ssr: false,
});
