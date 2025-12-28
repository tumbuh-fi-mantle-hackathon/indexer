export const ProtocolAbi = [
  {
    type: "event",
    name: "APYUpdated",
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "oldBps",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "newBps",
        type: "uint16",
      },
    ],
  },
  {
    type: "event",
    name: "Accrued",
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newVirtualAssets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "apyBps",
    inputs: [],
    outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalAssets",
    inputs: [],
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;
