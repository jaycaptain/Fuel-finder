import { Badge, Icon } from '@fuel-explorer/ui';
import type { BadgeProps, IconComponent, BaseProps } from '@fuel-explorer/ui';
import {
  IconCode,
  IconCoins,
  IconFlame,
  IconScript,
  IconSwitch3,
  IconTransfer,
  IconWallet,
} from '@tabler/icons-react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import type { TxAccountType, TxStatus, TxType } from '../../types';

const TX_ICON_MAP: Record<TxType | TxAccountType, IconComponent> = {
  ContractCall: IconCode,
  Mint: IconCoins,
  Transfer: IconTransfer,
  Burn: IconFlame,
  Contract: IconScript,
  Wallet: IconWallet,
  Predicate: IconSwitch3,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TX_INTENT_MAP: Record<TxStatus, any> = {
  Success: 'green',
  Failure: 'red',
  Submitted: 'gray',
  Info: 'sky',
  Warning: 'yellow',
};

const TX_STATUS_MAP: Record<TxStatus, string> = {
  Success: 'Success',
  Submitted: 'Submitted',
  Failure: 'Failure',
  Info: 'Info',
  Warning: 'Waiting',
};

type TxIconProps = VariantProps<typeof styles> &
  BaseProps<{
    type: TxType | TxAccountType;
    status?: TxStatus;
    color?: BadgeProps['color'];
    label?: string;
  }>;

export function TxIcon({
  type,
  status,
  size = 'md',
  className,
  color,
  label: initLabel,
  ...props
}: TxIconProps) {
  const label = initLabel ?? TX_STATUS_MAP[status || 'Submitted'];
  const classes = styles({ size });
  return (
    <Badge
      {...props}
      aria-label={label}
      className={classes.root({ className })}
      color={color || TX_INTENT_MAP[status || 'Submitted']}
      radius="full"
      variant="soft"
    >
      <Icon className={classes.icon()} icon={TX_ICON_MAP[type]} />
    </Badge>
  );
}

const styles = tv({
  slots: {
    root: 'inline-flex items-center justify-center',
    icon: 'text-current',
  },
  variants: {
    size: {
      sm: {
        root: 'w-8 h-8',
        icon: 'w-4 h-4',
      },
      md: {
        root: 'w-11 h-11',
        icon: 'w-5 h-5',
      },
      lg: {
        root: 'w-12 h-12',
        icon: 'w-6 h-6',
      },
    },
  },
});
