export const FeeCollectorAbi = [
  {
    type: "event",
    name: "FeesAdded",
    inputs: [
      { name: "token", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "treasuryAmount", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FeesCollected",
    inputs: [
      { name: "token", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "collector", type: "address", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TreasuryCollected",
    inputs: [
      { name: "token", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "collector", type: "address", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokenAdded",
    inputs: [{ name: "token", type: "address", indexed: true }],
    anonymous: false,
  },
] as const;
