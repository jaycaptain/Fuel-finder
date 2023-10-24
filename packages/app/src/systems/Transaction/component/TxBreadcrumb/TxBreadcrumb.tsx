'use client';

import type { BreadcrumbProps } from '@fuels/ui';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Text,
} from '@fuels/ui';
import { IconHome } from '@tabler/icons-react';
import Link from 'next/link';
import { Address } from '~/systems/Core/components/Address/Address';

type TxBreadcrumbProps = BreadcrumbProps & {
  transactionId: string;
};

export function TxBreadcrumb({ transactionId, ...props }: TxBreadcrumbProps) {
  return (
    <Breadcrumb {...props} className="flex items-center gap-2">
      <BreadcrumbLink asChild>
        <Link href="/">
          <Icon icon={IconHome} size={24} color="text-muted" />
        </Link>
      </BreadcrumbLink>
      <BreadcrumbItem>
        <Text size={'6'} weight={'medium'} className="mr-4 color-current">
          Transaction
        </Text>
        <Address full id={transactionId} />
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
