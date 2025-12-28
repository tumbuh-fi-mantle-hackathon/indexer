import { ponder } from "ponder:registry";
import {
  deposits,
  withdrawals,
  vaultStats,
  userPositions,
  rewards,
  harvestHistory,
  recentActivity,
  protocolAPY,
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

const protocolTokenMap: Record<string, { protocol: string; token: string }> = {
  "0x89159c2a782ba2cae40ec25c39a1f38397f1eed5": {
    protocol: "Beefy",
    token: "cmETH",
  },
  "0x54ddde71d46409b919b8b29ad52133067b8441fb": {
    protocol: "Beefy",
    token: "mETH",
  },
  "0x5044c96dd29630fac0aa7a4ed8c03c0d0e28aa99": {
    protocol: "Beefy",
    token: "USDT",
  },
  "0xfa699fdc577f6b9538f6b979a327aed38ff27f57": {
    protocol: "Beefy",
    token: "USDC",
  },

  "0x91f048130c88c1f759a9bdc19883559d3dc275a6": {
    protocol: "Compound",
    token: "cmETH",
  },
  "0xd95d2f7c38bfa2f9d7a618474bc619470f01001f": {
    protocol: "Compound",
    token: "mETH",
  },
  "0x763a03a3328e475f75ee2dd0329b27f02eed2443": {
    protocol: "Compound",
    token: "USDT",
  },
  "0x4399b055b86c65bc2e91333d9118f98b974f052c": {
    protocol: "Compound",
    token: "USDC",
  },

  "0xf8c1cfd46a543efb13305b041fc573550207fa79": {
    protocol: "Dolomite",
    token: "cmETH",
  },
  "0xc3a0701cebea2b97c460fd147f2eb41d7a286417": {
    protocol: "Dolomite",
    token: "mETH",
  },
  "0x33efb6eb5bc283917cd212655685f7efbaab8d52": {
    protocol: "Dolomite",
    token: "USDT",
  },
  "0x9d583462ed3aada10ec86ac909d4db27f79866a7": {
    protocol: "Dolomite",
    token: "USDC",
  },

  "0x9a53dbaaccbbff2721168673ac7738422bd4d1e9": {
    protocol: "InitCapital",
    token: "cmETH",
  },
  "0x40199df02e052be29bbf289fbb7717cd0be8ee80": {
    protocol: "InitCapital",
    token: "mETH",
  },
  "0xe7ba244c2597ada3e6181577b9758c90f5802f13": {
    protocol: "InitCapital",
    token: "USDT",
  },
  "0x0d36746783656989f8d7c03f6bfb80910d32f778": {
    protocol: "InitCapital",
    token: "USDC",
  },
};

const handleAPYUpdated = async (
  event: any,
  context: any,
  protocolAddress: string
) => {
  const { newBps } = event.args;
  const info = protocolTokenMap[protocolAddress.toLowerCase()];
  if (!info) return;

  const id = `${info.protocol.toLowerCase()}_${info.token.toLowerCase()}`;

  await context.db
    .insert(protocolAPY)
    .values({
      id,
      protocolName: info.protocol,
      protocolAddress: protocolAddress.toLowerCase(),
      token: info.token,
      apyBps: Number(newBps),
      lastUpdatedBlock: event.block.number,
      lastUpdatedTimestamp: event.block.timestamp,
    })
    .onConflictDoUpdate({
      apyBps: Number(newBps),
      lastUpdatedBlock: event.block.number,
      lastUpdatedTimestamp: event.block.timestamp,
    });
};

ponder.on("BeefyCmETH:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0x89159c2a782ba2cae40ec25c39a1f38397f1eed5"
  );
});
ponder.on("BeefyMETH:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0x54ddde71d46409b919b8b29ad52133067b8441fb"
  );
});
ponder.on("BeefyUSDT:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0x5044c96dd29630fac0aa7a4ed8c03c0d0e28aa99"
  );
});
ponder.on("BeefyUSDC:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0xfa699fdc577f6b9538f6b979a327aed38ff27f57"
  );
});

ponder.on("CompoundCmETH:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0x91f048130c88c1f759a9bdc19883559d3dc275a6"
  );
});
ponder.on("CompoundMETH:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0xd95d2f7c38bfa2f9d7a618474bc619470f01001f"
  );
});
ponder.on("CompoundUSDT:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0x763a03a3328e475f75ee2dd0329b27f02eed2443"
  );
});
ponder.on("CompoundUSDC:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0x4399b055b86c65bc2e91333d9118f98b974f052c"
  );
});

ponder.on("DolomiteCmETH:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0xf8c1cfd46a543efb13305b041fc573550207fa79"
  );
});
ponder.on("DolomiteMETH:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0xc3a0701cebea2b97c460fd147f2eb41d7a286417"
  );
});
ponder.on("DolomiteUSDT:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0x33efb6eb5bc283917cd212655685f7efbaab8d52"
  );
});
ponder.on("DolomiteUSDC:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0x9d583462ed3aada10ec86ac909d4db27f79866a7"
  );
});

ponder.on("InitCapitalCmETH:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0x9a53dbaaccbbff2721168673ac7738422bd4d1e9"
  );
});
ponder.on("InitCapitalMETH:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0x40199df02e052be29bbf289fbb7717cd0be8ee80"
  );
});
ponder.on("InitCapitalUSDT:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0xe7ba244c2597ada3e6181577b9758c90f5802f13"
  );
});
ponder.on("InitCapitalUSDC:APYUpdated", async ({ event, context }) => {
  await handleAPYUpdated(
    event,
    context,
    "0x0d36746783656989f8d7c03f6bfb80910d32f778"
  );
});
