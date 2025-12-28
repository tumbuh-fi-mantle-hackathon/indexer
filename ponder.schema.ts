import { onchainTable, index } from "ponder";

export const deposits = onchainTable(
  "deposits",
  (t) => ({
    id: t.text().primaryKey(),
    vaultAddress: t.text().notNull(),
    token: t.text().notNull(),
    receiver: t.text().notNull(),
    owner: t.text().notNull(),
    assets: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.text().notNull(),
  }),
  (table) => ({
    receiverIdx: index().on(table.receiver),
    vaultIdx: index().on(table.vaultAddress),
  })
);

export const withdrawals = onchainTable(
  "withdrawals",
  (t) => ({
    id: t.text().primaryKey(),
    vaultAddress: t.text().notNull(),
    token: t.text().notNull(),
    receiver: t.text().notNull(),
    owner: t.text().notNull(),
    assets: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.text().notNull(),
  }),
  (table) => ({
    receiverIdx: index().on(table.receiver),
    vaultIdx: index().on(table.vaultAddress),
  })
);

export const vaultStats = onchainTable("vault_stats", (t) => ({
  id: t.text().primaryKey(),
  token: t.text().notNull(),
  totalDeposits: t.bigint().notNull(),
  totalWithdrawals: t.bigint().notNull(),
  netDeposits: t.bigint().notNull(),
  depositCount: t.integer().notNull(),
  withdrawCount: t.integer().notNull(),
  lastUpdatedBlock: t.bigint().notNull(),
}));

export const userPositions = onchainTable(
  "user_positions",
  (t) => ({
    id: t.text().primaryKey(),
    userAddress: t.text().notNull(),
    vaultAddress: t.text().notNull(),
    token: t.text().notNull(),
    balance: t.bigint().notNull(),
    totalDeposited: t.bigint().notNull(),
    totalWithdrawn: t.bigint().notNull(),
    lastUpdatedBlock: t.bigint().notNull(),
  }),
  (table) => ({
    userIdx: index().on(table.userAddress),
    vaultIdx: index().on(table.vaultAddress),
  })
);

export const rewards = onchainTable(
  "rewards",
  (t) => ({
    id: t.text().primaryKey(),
    userAddress: t.text().notNull(),
    token: t.text().notNull(),
    amount: t.bigint().notNull(),
    vaultAddress: t.text().notNull(),
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.text().notNull(),
  }),
  (table) => ({
    userIdx: index().on(table.userAddress),
  })
);

export const harvestHistory = onchainTable(
  "harvest_history",
  (t) => ({
    id: t.text().primaryKey(),
    vaultAddress: t.text().notNull(),
    token: t.text().notNull(),
    amount: t.bigint().notNull(),
    harvestTimestamp: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    transactionHash: t.text().notNull(),
  }),
  (table) => ({
    vaultIdx: index().on(table.vaultAddress),
    timestampIdx: index().on(table.harvestTimestamp),
  })
);

export const recentActivity = onchainTable(
  "recent_activity",
  (t) => ({
    id: t.text().primaryKey(),
    activityType: t.text().notNull(),
    vaultAddress: t.text().notNull(),
    token: t.text().notNull(),
    userAddress: t.text().notNull(),
    amount: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.text().notNull(),
  }),
  (table) => ({
    vaultIdx: index().on(table.vaultAddress),
    timestampIdx: index().on(table.timestamp),
  })
);
