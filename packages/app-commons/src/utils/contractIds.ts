import { ETH_CHAIN_NAME, FUEL_CHAIN_NAME } from '../config';

export type BridgeTokenContracts = {
  ETH_ERC20: string;
  FUEL_TokenContract: string;
  FUEL_TokenAsset?: string;
};
export type BridgeSolidityContracts = {
  FuelChainState: `0x${string}`;
  FuelMessagePortal: `0x${string}`;
  FuelERC20Gateway: `0x${string}`;
  FuelERC721Gateway: `0x${string}`;
};

let bridgeTokenContract: BridgeTokenContracts;
let bridgeSolidityContracts: BridgeSolidityContracts;

export async function getBridgeTokenContracts() {
  if (bridgeTokenContract) return bridgeTokenContract;

  if (FUEL_CHAIN_NAME === 'fuelLocal') {
    try {
      const res = await fetch('http://localhost:8082/deployments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      const body = await res.json();
      bridgeTokenContract = body;

      return bridgeTokenContract;
    } catch (_) {
      return undefined;
    }
  }

  if (ETH_CHAIN_NAME === 'sepolia') {
    const ETH_ERC20 = '0xC6387efAD0F184a90B34f397C3d6Fd63135ef790';
    if (FUEL_CHAIN_NAME === 'fuelTestnet') {
      // @TODO: needs to change this to enable ERC20
      bridgeTokenContract = {
        ETH_ERC20,
        FUEL_TokenContract: '0x',
      };

      return bridgeTokenContract;
    }
  }
}

export async function getBridgeSolidityContracts() {
  if (ETH_CHAIN_NAME === 'foundry') {
    const res = await fetch('http://localhost:8080/deployments.local.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    const body = await res.json();
    bridgeSolidityContracts = body;

    return bridgeSolidityContracts;
  }

  if (ETH_CHAIN_NAME === 'sepolia') {
    if (FUEL_CHAIN_NAME === 'fuelTestnet') {
      bridgeSolidityContracts = {
        FuelChainState: '0x404F391F96798B14C5e99BBB4a9C858da9Cf63b5',
        FuelMessagePortal: '0x01855B78C1f8868DE70e84507ec735983bf262dA',
        FuelERC20Gateway: '0xa97200022c7aDb1b15f0f61f374E3A0c90e2Efa0',
        FuelERC721Gateway: '0x',
      };

      return bridgeSolidityContracts;
    }
  }

  return bridgeSolidityContracts;
}
