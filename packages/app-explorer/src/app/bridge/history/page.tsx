'use client';

import dynamicImport from 'next/dynamic';
import { BridgeScreenLoader } from '~/systems/Bridge/components/BridgeScreenLoader';

const Page = dynamicImport(
  async () => import('app-portal').then((mod) => mod.BridgeHistoryPage),
  {
    ssr: false,
    loading: () => <BridgeScreenLoader view="history" />,
  },
);

export default function BridgePage() {
  return <Page />;
}

export const dynamic = 'force-static';
