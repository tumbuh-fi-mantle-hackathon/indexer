export const CoreAbi = [
  {
    type: "event",
    name: "Deposit",
    inputs: [
      { name: "assets", type: "uint256", indexed: false },
      { name: "receiver", type: "address", indexed: true },
      { name: "owner", type: "address", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      { name: "assets", type: "uint256", indexed: false },
      { name: "receiver", type: "address", indexed: true },
      { name: "owner", type: "address", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RewardHarvested",
    inputs: [
      { name: "token", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RewardDistributed",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "token", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UpdateStrategy",
    inputs: [
      { name: "adapter", type: "address", indexed: true },
      { name: "vault", type: "address", indexed: true },
      { name: "asset", type: "address", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
] as const;
