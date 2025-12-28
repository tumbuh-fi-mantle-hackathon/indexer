import { ponder } from "ponder:registry";
import {
  deposits,
  withdrawals,
  vaultStats,
  userPositions,
  rewards,
  harvestHistory,
  recentActivity,
} from "ponder:schema";

const vaultTokenMap: Record<string, string> = {
  "0x32ecd5f7442ae3b4257557d696c6d68722000008": "cmETH",
  "0x80e6a5e648e97ff1da61c4484d1f41b068c737d3": "mETH",
  "0x5c2c580bc9a9f7c7c3e7c768b77c6a34510606cc": "USDT",
  "0x6da8058acf83d9ce89610e4c50bd6a35c7c9650b": "USDC",
};

function getToken(vaultAddress: string): string {
  return vaultTokenMap[vaultAddress.toLowerCase()] || "UNKNOWN";
}

function createId(txHash: string, logIndex: number, suffix?: string): string {
  return suffix ? `${txHash}-${logIndex}-${suffix}` : `${txHash}-${logIndex}`;
}

const handleDeposit = async (
  event: any,
  context: any,
  vaultAddress: string
) => {
  const { assets, receiver, owner } = event.args;
  const token = getToken(vaultAddress);
  const id = createId(event.transaction.hash, event.log.logIndex);

  await context.db.insert(deposits).values({
    id,
    vaultAddress: vaultAddress.toLowerCase(),
    token,
    receiver: receiver.toLowerCase(),
    owner: owner.toLowerCase(),
    assets,
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });

  const statsId = vaultAddress.toLowerCase();
  await context.db
    .insert(vaultStats)
    .values({
      id: statsId,
      token,
      totalDeposits: assets,
      totalWithdrawals: 0n,
      netDeposits: assets,
      depositCount: 1,
      withdrawCount: 0,
      lastUpdatedBlock: event.block.number,
    })
    .onConflictDoUpdate((current: any) => ({
      totalDeposits: current.totalDeposits + assets,
      netDeposits: current.netDeposits + assets,
      depositCount: current.depositCount + 1,
      lastUpdatedBlock: event.block.number,
    }));

  const positionId = `${receiver.toLowerCase()}-${vaultAddress.toLowerCase()}`;
  await context.db
    .insert(userPositions)
    .values({
      id: positionId,
      userAddress: receiver.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
      token,
      balance: assets,
      totalDeposited: assets,
      totalWithdrawn: 0n,
      lastUpdatedBlock: event.block.number,
    })
    .onConflictDoUpdate((current: any) => ({
      balance: current.balance + assets,
      totalDeposited: current.totalDeposited + assets,
      lastUpdatedBlock: event.block.number,
    }));

  await context.db.insert(recentActivity).values({
    id: createId(event.transaction.hash, event.log.logIndex, "deposit"),
    activityType: "deposit",
    vaultAddress: vaultAddress.toLowerCase(),
    token,
    userAddress: receiver.toLowerCase(),
    amount: assets,
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });
};

const handleWithdraw = async (
  event: any,
  context: any,
  vaultAddress: string
) => {
  const { assets, receiver, owner } = event.args;
  const token = getToken(vaultAddress);
  const id = createId(event.transaction.hash, event.log.logIndex);

  await context.db.insert(withdrawals).values({
    id,
    vaultAddress: vaultAddress.toLowerCase(),
    token,
    receiver: receiver.toLowerCase(),
    owner: owner.toLowerCase(),
    assets,
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });

  const statsId = vaultAddress.toLowerCase();
  await context.db
    .insert(vaultStats)
    .values({
      id: statsId,
      token,
      totalDeposits: 0n,
      totalWithdrawals: assets,
      netDeposits: -assets,
      depositCount: 0,
      withdrawCount: 1,
      lastUpdatedBlock: event.block.number,
    })
    .onConflictDoUpdate((current: any) => ({
      totalWithdrawals: current.totalWithdrawals + assets,
      netDeposits: current.netDeposits - assets,
      withdrawCount: current.withdrawCount + 1,
      lastUpdatedBlock: event.block.number,
    }));

  const positionId = `${owner.toLowerCase()}-${vaultAddress.toLowerCase()}`;
  await context.db
    .insert(userPositions)
    .values({
      id: positionId,
      userAddress: owner.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
      token,
      balance: -assets,
      totalDeposited: 0n,
      totalWithdrawn: assets,
      lastUpdatedBlock: event.block.number,
    })
    .onConflictDoUpdate((current: any) => ({
      balance: current.balance - assets,
      totalWithdrawn: current.totalWithdrawn + assets,
      lastUpdatedBlock: event.block.number,
    }));

  await context.db.insert(recentActivity).values({
    id: createId(event.transaction.hash, event.log.logIndex, "withdraw"),
    activityType: "withdraw",
    vaultAddress: vaultAddress.toLowerCase(),
    token,
    userAddress: owner.toLowerCase(),
    amount: assets,
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });
};

const handleRewardHarvested = async (
  event: any,
  context: any,
  vaultAddress: string
) => {
  const { token: rewardToken, amount, timestamp } = event.args;
  const token = getToken(vaultAddress);
  const id = createId(event.transaction.hash, event.log.logIndex);

  await context.db.insert(harvestHistory).values({
    id,
    vaultAddress: vaultAddress.toLowerCase(),
    token,
    amount,
    harvestTimestamp: timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash,
  });
};

const handleRewardDistributed = async (
  event: any,
  context: any,
  vaultAddress: string
) => {
  const { user, token: rewardToken, amount } = event.args;
  const token = getToken(vaultAddress);
  const id = createId(event.transaction.hash, event.log.logIndex);

  await context.db.insert(rewards).values({
    id,
    userAddress: user.toLowerCase(),
    token,
    amount,
    vaultAddress: vaultAddress.toLowerCase(),
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });

  await context.db.insert(recentActivity).values({
    id: createId(event.transaction.hash, event.log.logIndex, "reward"),
    activityType: "reward",
    vaultAddress: vaultAddress.toLowerCase(),
    token,
    userAddress: user.toLowerCase(),
    amount,
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });
};

ponder.on("CoreCmETH:Deposit", async ({ event, context }) => {
  await handleDeposit(
    event,
    context,
    "0x32ecd5f7442ae3b4257557d696c6d68722000008"
  );
});

ponder.on("CoreCmETH:Withdraw", async ({ event, context }) => {
  await handleWithdraw(
    event,
    context,
    "0x32ecd5f7442ae3b4257557d696c6d68722000008"
  );
});

ponder.on("CoreCmETH:RewardHarvested", async ({ event, context }) => {
  await handleRewardHarvested(
    event,
    context,
    "0x32ecd5f7442ae3b4257557d696c6d68722000008"
  );
});

ponder.on("CoreCmETH:RewardDistributed", async ({ event, context }) => {
  await handleRewardDistributed(
    event,
    context,
    "0x32ecd5f7442ae3b4257557d696c6d68722000008"
  );
});

ponder.on("CoreMETH:Deposit", async ({ event, context }) => {
  await handleDeposit(
    event,
    context,
    "0x80e6a5e648e97ff1da61c4484d1f41b068c737d3"
  );
});

ponder.on("CoreMETH:Withdraw", async ({ event, context }) => {
  await handleWithdraw(
    event,
    context,
    "0x80e6a5e648e97ff1da61c4484d1f41b068c737d3"
  );
});

ponder.on("CoreMETH:RewardHarvested", async ({ event, context }) => {
  await handleRewardHarvested(
    event,
    context,
    "0x80e6a5e648e97ff1da61c4484d1f41b068c737d3"
  );
});

ponder.on("CoreMETH:RewardDistributed", async ({ event, context }) => {
  await handleRewardDistributed(
    event,
    context,
    "0x80e6a5e648e97ff1da61c4484d1f41b068c737d3"
  );
});

ponder.on("CoreUSDT:Deposit", async ({ event, context }) => {
  await handleDeposit(
    event,
    context,
    "0x5c2c580bc9a9f7c7c3e7c768b77c6a34510606cc"
  );
});

ponder.on("CoreUSDT:Withdraw", async ({ event, context }) => {
  await handleWithdraw(
    event,
    context,
    "0x5c2c580bc9a9f7c7c3e7c768b77c6a34510606cc"
  );
});

ponder.on("CoreUSDT:RewardHarvested", async ({ event, context }) => {
  await handleRewardHarvested(
    event,
    context,
    "0x5c2c580bc9a9f7c7c3e7c768b77c6a34510606cc"
  );
});

ponder.on("CoreUSDT:RewardDistributed", async ({ event, context }) => {
  await handleRewardDistributed(
    event,
    context,
    "0x5c2c580bc9a9f7c7c3e7c768b77c6a34510606cc"
  );
});

ponder.on("CoreUSDC:Deposit", async ({ event, context }) => {
  await handleDeposit(
    event,
    context,
    "0x6da8058acf83d9ce89610e4c50bd6a35c7c9650b"
  );
});

ponder.on("CoreUSDC:Withdraw", async ({ event, context }) => {
  await handleWithdraw(
    event,
    context,
    "0x6da8058acf83d9ce89610e4c50bd6a35c7c9650b"
  );
});

ponder.on("CoreUSDC:RewardHarvested", async ({ event, context }) => {
  await handleRewardHarvested(
    event,
    context,
    "0x6da8058acf83d9ce89610e4c50bd6a35c7c9650b"
  );
});

ponder.on("CoreUSDC:RewardDistributed", async ({ event, context }) => {
  await handleRewardDistributed(
    event,
    context,
    "0x6da8058acf83d9ce89610e4c50bd6a35c7c9650b"
  );
});
