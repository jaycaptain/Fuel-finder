import type {
  ChangeOutput,
  CoinOutput,
  ContractCreated,
  ContractOutput,
  TransactionOutputFragment,
} from '@fuel-explorer/graphql';
import {
  Address,
  Card,
  HStack,
  Icon,
  Text,
  VStack,
  createComponent,
  cx,
} from '@fuels/ui';
import type { CardProps } from '@fuels/ui';
import { IconArrowUp } from '@tabler/icons-react';
import { bn } from 'fuels';
import NextLink from 'next/link';
import React from 'react';
import { tv } from 'tailwind-variants';
import { Routes } from '~/routes';
import { AssetItem } from '~/systems/Asset/components/AssetItem/AssetItem';
import { Amount } from '~/systems/Core/components/Amount/Amount';
import { TxIcon } from '../TxIcon/TxIcon';
import { isOutput } from './TxOutput.utils';

type TxOutputProps<T = TransactionOutputFragment> = CardProps & {
  output: T;
};

const TxOutputCoin = createComponent<
  TxOutputProps<ChangeOutput | CoinOutput>,
  typeof Card
>({
  id: 'TxOutputCoin',
  render: (_, { output, ...props }) => {
    const classes = styles();
    if (!output.assetId) return null;
    const assetId = output.assetId;
    const amount = output.amount;

    return (
      <Card {...props} className={cx('py-3', props.className)}>
        <Card.Header className={classes.header()}>
          <AssetItem assetId={assetId}>
            <Address
              prefix="To:"
              value={output.to || ''}
              linkProps={{
                as: NextLink,
                href: Routes.accountAssets(output.to!),
              }}
            />
          </AssetItem>
          {/*
            I'm just hidding this until we get the output/input design merged 
            https://linear.app/fuel-network/issue/FE-18/change-inputs-and-outputs-component-for-better-relevance
          */}
          <HStack className="hidden tablet:flex items-center gap-2">
            <Icon icon={IconArrowUp} className="text-success" />
            {amount && (
              <Amount
                hideSymbol
                hideIcon
                assetId={assetId}
                value={bn(amount)}
              />
            )}
          </HStack>
        </Card.Header>
      </Card>
    );
  },
});

const TxOutputContract = createComponent<
  TxOutputProps<ContractOutput>,
  typeof Card
>({
  id: 'TxOutputContract',
  render: (_, { output, ...props }) => {
    const classes = styles();

    return (
      <Card {...props} className={cx('py-3', props.className)}>
        <Card.Header className={classes.header()}>
          <HStack align="center">
            <TxIcon status="Submitted" type="Contract" />
            <VStack gap="1">
              <Text className="font-medium">Contract Output</Text>
              <Text className="text-sm text-secondary">
                Input Index: {output.inputIndex}
              </Text>
            </VStack>
          </HStack>
        </Card.Header>
      </Card>
    );
  },
});

const TxOutputContractCreated = createComponent<
  TxOutputProps<ContractCreated>,
  typeof Card
>({
  id: 'TxOutputContractCreated',
  render: (_, { output, ...props }) => {
    const classes = styles();
    const contractId = output.contract;

    return (
      <Card {...props} className={cx('py-3', props.className)}>
        <Card.Header className={classes.header()}>
          <HStack align="center">
            <TxIcon status="Success" type="Contract" />
            <VStack gap="1">
              <Text className="font-medium">Contract Created</Text>
              <Address
                prefix="Id:"
                value={contractId}
                linkProps={{
                  as: NextLink,
                  href: Routes.contractAssets(contractId),
                }}
              />
            </VStack>
          </HStack>
        </Card.Header>
      </Card>
    );
  },
});

export function TxOutput({ output, ...props }: TxOutputProps) {
  if (
    isOutput<ChangeOutput>(output, 'ChangeOutput') ||
    isOutput<CoinOutput>(output, 'CoinOutput')
  ) {
    return <TxOutputCoin output={output} {...props} />;
  }
  if (isOutput<ContractOutput>(output, 'ContractOutput')) {
    return <TxOutputContract output={output} {...props} />;
  }
  if (isOutput<ContractCreated>(output, 'ContractCreated')) {
    return <TxOutputContractCreated output={output} {...props} />;
  }

  return null;
}

const styles = tv({
  slots: {
    header: 'group flex flex-row gap-4 justify-between items-center',
    icon: 'transition-transform group-data-[state=closed]:hover:rotate-180 group-data-[state=open]:rotate-180',
    utxos: 'bg-gray-2 mx-4 py-3 px-4 rounded',
  },
});
