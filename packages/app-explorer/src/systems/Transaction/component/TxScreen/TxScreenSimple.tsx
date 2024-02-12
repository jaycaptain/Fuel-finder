/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { GroupedInput, GroupedOutput } from '@fuel-explorer/graphql';
import {
  Address,
  Badge,
  Box,
  Card,
  EntityItem,
  Flex,
  Grid,
  HStack,
  Heading,
  Icon,
  Link,
  LoadingBox,
  LoadingWrapper,
  Text,
  VStack,
} from '@fuels/ui';
import { IconArrowDown } from '@tabler/icons-react';
import { bn } from 'fuels';
import NextLink from 'next/link';
import { tv } from 'tailwind-variants';
import { Routes } from '~/routes';
import { Amount } from '~/systems/Core/components/Amount/Amount';
import { EmptyCard } from '~/systems/Core/components/EmptyCard/EmptyCard';
import { formatZeroUnits } from '~/systems/Core/utils/format';

import { CardInfo } from '../../../Core/components/CardInfo/CardInfo';
import { TxInput } from '../../component/TxInput/TxInput';
import { TxOutput } from '../../component/TxOutput/TxOutput';
import type { TransactionNode, TxStatus } from '../../types';
import { TX_INTENT_MAP, TxIcon } from '../TxIcon/TxIcon';
import { TxScripts } from '../TxScripts/TxScripts';

type TxScreenProps = {
  transaction: TransactionNode;
  isLoading?: boolean;
};

export function TxScreenSimple({ transaction: tx, isLoading }: TxScreenProps) {
  const title = tx.title as string;
  const isMint = Boolean(tx.isMint);
  const classes = styles({ isMint });

  const cards = [
    <CardInfo key="type">
      <EntityItem>
        <EntityItem.Slot>
          <LoadingWrapper
            isLoading={isLoading}
            loadingEl={<LoadingBox className="w-11 h-11 rounded-full" />}
            regularEl={
              <TxIcon
                type={title}
                size="lg"
                status={tx.isPredicate ? 'Info' : (tx.statusType as TxStatus)}
              />
            }
          />
        </EntityItem.Slot>
        <EntityItem.Info
          title={
            (
              <LoadingWrapper
                isLoading={isLoading}
                loadingEl={<LoadingBox className="w-20 h-6" />}
                regularEl={title}
              />
            ) as any
          }
        >
          <HStack gap="1">
            {tx.isPredicate && (
              <Badge color="blue" variant="ghost">
                Predicate
              </Badge>
            )}
            <LoadingWrapper
              isLoading={isLoading}
              loadingEl={<LoadingBox className="w-20 h-6" />}
              regularEl={
                <Badge
                  color={TX_INTENT_MAP[tx.statusType as string]}
                  variant="ghost"
                >
                  {tx.statusType}
                </Badge>
              }
            />
          </HStack>
        </EntityItem.Info>
      </EntityItem>
    </CardInfo>,
    <CardInfo
      key="timestamp"
      name={'Timestamp'}
      description={
        <LoadingWrapper
          isLoading={isLoading}
          loadingEl={<LoadingBox className="w-40 h-5 mt-1" />}
          regularEl={tx.time?.full}
        />
      }
    >
      <LoadingWrapper
        isLoading={isLoading}
        loadingEl={<LoadingBox className="w-24 h-6" />}
        regularEl={tx.time?.fromNow}
      />
    </CardInfo>,
    (tx.blockHeight || isLoading) && (
      <CardInfo key="block" name={'Block'}>
        <LoadingWrapper
          isLoading={isLoading}
          loadingEl={<LoadingBox className="w-28 h-6" />}
          regularEl={
            <Link
              as={NextLink}
              href={Routes.blockSimple(tx.blockHeight || '')}
              className="text-link"
            >
              #{tx.blockHeight}
            </Link>
          }
        />
      </CardInfo>
    ),
    <CardInfo
      key={'fee'}
      name={'Network Fee'}
      description={
        <LoadingWrapper
          isLoading={isLoading}
          regularEl={<>Gas used: {formatZeroUnits(tx.gasUsed || '')}</>}
          loadingEl={
            <>
              <LoadingBox className="w-28 h-5 mt-2" />
              <LoadingBox className="w-28 h-5 mt-1" />
            </>
          }
        />
      }
    >
      <LoadingWrapper
        isLoading={isLoading}
        loadingEl={<LoadingBox className="w-36 h-6" />}
        regularEl={`${bn(tx.fee).format()} ETH`}
      />
    </CardInfo>,
  ];

  return (
    <Grid className={classes.wrapper()}>
      <Box className={classes.cards()}>{cards}</Box>
      <ContentMain tx={tx} isLoading={isLoading} />
    </Grid>
  );
}

function ContentMain({
  tx,
  isLoading,
}: {
  tx: TransactionNode;
  isLoading?: boolean;
}) {
  const hasInputs = tx.groupedInputs?.length ?? 0 > 0;
  const hasOutputs = tx.groupedOutputs?.length ?? 0 > 0;

  return (
    <VStack>
      <VStack>
        <LoadingWrapper
          isLoading={isLoading}
          repeatLoader={2}
          noItems={!hasInputs}
          loadingEl={
            <Card className="py-4 px-4 flex flex-row items-center justify-between">
              <LoadingBox className="rounded-full w-[38px] h-[38px]" />
              <LoadingBox className="w-24 h-6" />
            </Card>
          }
          regularEl={tx.groupedInputs?.map((input, i) => (
            // here we use only index as key because this component will not change
            <>
              <Heading as="h2" size="5" className="leading-none">
                Inputs
              </Heading>
              <TxInput key={i} input={input as GroupedInput} />
            </>
          ))}
          noItemsEl={
            <EmptyCard hideImage>
              <EmptyCard.Title>No Inputs</EmptyCard.Title>
              <EmptyCard.Description>
                This transaction does not have any inputs.
              </EmptyCard.Description>
            </EmptyCard>
          }
        />
      </VStack>
      <Flex justify="center">
        <Icon icon={IconArrowDown} size={30} color="text-muted" />
      </Flex>
      <TxScripts tx={tx} isLoading={isLoading} />
      <Flex justify="center">
        <Icon icon={IconArrowDown} size={30} color="text-muted" />
      </Flex>
      <VStack>
        {tx.isMint ? (
          <MintOutputs tx={tx} isLoading={Boolean(isLoading)} />
        ) : (
          <LoadingWrapper
            isLoading={isLoading}
            repeatLoader={2}
            noItems={!hasOutputs}
            loadingEl={
              <Card className="py-4 px-4 flex flex-row items-center justify-between">
                <LoadingBox className="rounded-full w-[38px] h-[38px]" />
                <LoadingBox className="w-24 h-6" />
              </Card>
            }
            regularEl={tx.groupedOutputs?.map((output, i) => (
              <>
                <Heading as="h2" size="5" className="leading-none">
                  Outputs
                </Heading>

                <TxOutput
                  // here we use only index as key because this component will not change
                  key={i}
                  tx={tx}
                  output={output as GroupedOutput}
                />
              </>
            ))}
            noItemsEl={
              <EmptyCard hideImage>
                <EmptyCard.Title>No Outputs</EmptyCard.Title>
                <EmptyCard.Description>
                  This transaction does not have any outputs.
                </EmptyCard.Description>
              </EmptyCard>
            }
          />
        )}
      </VStack>
    </VStack>
  );
}

function MintOutputs({
  tx,
  isLoading,
}: {
  tx: TransactionNode;
  isLoading: boolean;
}) {
  const inputContractId = tx.inputContract?.contract?.id;
  const hasInputContract = Boolean(inputContractId);

  const content = (
    <VStack>
      <Heading as="h2" size="5" className="leading-none">
        Outputs
      </Heading>
      <Card>
        <Card.Body className="flex flex-col gap-2">
          {tx.mintAssetId && (
            <HStack>
              <Text as="span" className="text-sm">
                Mint Amount
              </Text>
              <Amount
                iconSize={16}
                assetId={tx.mintAssetId}
                value={bn(tx.mintAmount)}
                className="text-xs tablet:text-sm"
              />
            </HStack>
          )}
          {tx.mintAssetId && (
            <HStack>
              <Text as="span" className="text-sm">
                Asset ID Minted
              </Text>
              <Address value={tx.mintAssetId} />
            </HStack>
          )}
          {hasInputContract && (
            <HStack>
              <Text as="span" className="text-sm">
                Input Contract
              </Text>
              <Address
                value={inputContractId}
                linkProps={{
                  as: NextLink,
                  href: Routes.accountAssets(inputContractId!),
                }}
              />
            </HStack>
          )}
          {tx.txPointer && (
            <HStack>
              <Text as="span" className="text-sm">
                Tx Pointer
              </Text>
              <Address full value={tx.txPointer} />
            </HStack>
          )}
        </Card.Body>
      </Card>
    </VStack>
  );

  return (
    <LoadingWrapper
      isLoading={isLoading}
      regularEl={content}
      loadingEl={
        <Card className="py-4 px-4 flex flex-col gap-2">
          <HStack>
            <LoadingBox className="w-20 h-6" />
            <LoadingBox className="w-40 h-6" />
          </HStack>
          <HStack>
            <LoadingBox className="w-20 h-6" />
            <LoadingBox className="w-40 h-6" />
          </HStack>
          <HStack>
            <LoadingBox className="w-20 h-6" />
            <LoadingBox className="w-40 h-6" />
          </HStack>
        </Card>
      }
    />
  );
}

const styles = tv({
  slots: {
    wrapper: [
      'grid-cols-1 gap-10 laptop:grid-cols-[300px_1fr] laptop:items-start',
    ],
    cards: [
      'grid grid-cols-1 gap-4 tablet:grid-cols-2 tablet:gap-6 laptop:grid-cols-1',
    ],
  },
  variants: {
    isMint: {
      true: {
        wrapper: [''],
        cards: [''],
      },
    },
  },
});
