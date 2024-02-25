import assetList from '@fuels/assets';
import type { Asset } from '@fuels/assets';
import {
  VITE_ETH_ERC20,
  VITE_FUEL_FUNGIBLE_ASSET_ID,
  VITE_FUEL_FUNGIBLE_CONTRACT_ID,
} from '~portal/config';
import { ETH_CHAIN, FUEL_CHAIN } from '~portal/systems/Chains/config';
import { getContractTokenId } from '~portal/systems/Chains/fuel/utils/contract';

const defaultAssets: Asset[] = [...assetList];

if (VITE_ETH_ERC20) {
  defaultAssets.push({
    icon: '',
    name: 'Test Token',
    symbol: 'TKN',
    networks: [
      {
        type: 'ethereum',
        chainId: ETH_CHAIN.id,
        decimals: 18,
        address: VITE_ETH_ERC20,
      },
      {
        type: 'fuel',
        chainId: FUEL_CHAIN.id,
        decimals: 9,
        contractId: VITE_FUEL_FUNGIBLE_CONTRACT_ID,
        assetId:
          VITE_FUEL_FUNGIBLE_ASSET_ID ||
          getContractTokenId(VITE_FUEL_FUNGIBLE_CONTRACT_ID as `0x${string}`),
      },
    ],
  });
}

export { defaultAssets };
