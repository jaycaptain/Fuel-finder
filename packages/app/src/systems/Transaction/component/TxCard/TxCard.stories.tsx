import type { Meta, StoryObj } from '@storybook/react';

import { TX_CONTRACT_CALL_MOCK } from '../__mocks__/tx';

import { TxCard } from './TxCard';

const meta: Meta<typeof TxCard> = {
  title: 'Transaction/TxCard',
  component: TxCard,
};

export default meta;
type Story = StoryObj<typeof TxCard>;

export const Usage: Story = {
  render: () => (
    <TxCard
      className="w-[350px]"
      transaction={TX_CONTRACT_CALL_MOCK['transaction'] as any}
    />
  ),
};
