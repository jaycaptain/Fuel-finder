import { relations } from 'drizzle-orm';
import { index, pgTable } from 'drizzle-orm/pg-core';
import { HashID } from '~/application/vo';
import { BlocksTable } from '~/domain/Block/BlockModel';
import { BlockRef } from '~/domain/Block/vo/BlockRef';
import { InputsTable } from '~/domain/Input/InputModel';
import { OutputsTable } from '~/domain/Output/OutputModel';
import { AccountIndex } from './vo/AccountIndex';
import { TransactionData } from './vo/TransactionData';
import { TransactionModelID } from './vo/TransactionModelID';
import { TransactionTimestamp } from './vo/TransactionTimestamp';

export const TransactionsTable = pgTable(
  'transactions',
  {
    _id: TransactionModelID.type(),
    transactionId: HashID.type(),
    timestamp: TransactionTimestamp.type(),
    data: TransactionData.type(),
    accountsIndex: AccountIndex.type(),
    blockId: BlockRef.type(),
  },
  (table) => ({
    timestampIdx: index().on(table.timestamp),
    idIdx: index().on(table._id),
  }),
);

export const transactionsReletaions = relations(
  TransactionsTable,
  ({ one, many }) => ({
    inputs: many(InputsTable, { relationName: 'transaction_inputs' }),
    outputs: many(OutputsTable, { relationName: 'transaction_outputs' }),
    block: one(BlocksTable, {
      fields: [TransactionsTable.blockId],
      references: [BlocksTable._id],
      relationName: 'transaction_block',
    }),
  }),
);

export type TransactionItem = typeof TransactionsTable.$inferSelect;
