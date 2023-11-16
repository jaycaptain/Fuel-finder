import { VStack } from '@fuels/ui';
import type { Meta, StoryObj } from '@storybook/react';

import {
  GROUPED_OUTPUT_ASSET,
  GROUPED_OUTPUT_ASSET_UNKNOWN,
  GROUPED_OUTPUT_CONTRACT_CREATED,
  GROUPED_OUTPUT_CONTRACT_OUTPUT,
  GROUPED_OUTPUT_MESSAGE,
} from '../../__mocks__/tx';

import { TxOutput } from './TxOutput';

const meta: Meta<typeof TxOutput> = {
  title: 'Transaction/TxOutput',
  component: TxOutput,
};

export default meta;
type Story = StoryObj<typeof TxOutput>;

export const Asset: Story = {
  render: () => (
    <VStack>
      <TxOutput className="w-[500px]" output={GROUPED_OUTPUT_ASSET} />
      <TxOutput className="w-[500px]" output={GROUPED_OUTPUT_ASSET_UNKNOWN} />
    </VStack>
  ),
};

export const ContractOutput: Story = {
  render: () => (
    <TxOutput className="w-[500px]" output={GROUPED_OUTPUT_CONTRACT_OUTPUT} />
  ),
};

export const ContractCreated: Story = {
  render: () => (
    <TxOutput className="w-[500px]" output={GROUPED_OUTPUT_CONTRACT_CREATED} />
  ),
};

export const Message: Story = {
  render: () => (
    <TxOutput className="w-[500px]" output={GROUPED_OUTPUT_MESSAGE} />
  ),
};
