'use client';

import { Address, VStack } from '@fuels/ui';
import { IconHash } from '@tabler/icons-react';
import { Layout } from '~/systems/Core/components/Layout/Layout';
import { PageTitle } from '~/systems/Core/components/PageTitle/PageTitle';

export function AccountLayout({
  children,
  id,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <PageTitle
        icon={<IconHash size={20} stroke={1.2} />}
        className="border-b-gray-3"
      >
        Account
        <Address full={true} value={id} />
      </PageTitle>
      <VStack className="gap-4 laptop:gap-8">{children}</VStack>
    </Layout>
  );
}
