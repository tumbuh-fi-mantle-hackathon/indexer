import { createConfig } from "ponder";

import { CoreAbi } from "./abis/CoreAbi";
import { FeeCollectorAbi } from "./abis/FeeCollectorAbi";

const coreMarkets = {
  cmETH: "0x32ecd5f7442ae3b4257557d696c6d68722000008" as const,
  mETH: "0x80e6a5e648e97ff1da61c4484d1f41b068c737d3" as const,
  USDT: "0x5c2c580bc9a9f7c7c3e7c768b77c6a34510606cc" as const,
  USDC: "0x6da8058acf83d9ce89610e4c50bd6a35c7c9650b" as const,
};

const feeCollector = {
  proxy: "0x0e8d24364eb713268566a80f7595780376b6dfc7" as const,
};

export default createConfig({
  chains: {
    mantleSepolia: {
      id: 5003,
      rpc: [process.env.PONDER_RPC_URL_5003!, process.env.PONDER_RPC_URL_5003_2!, process.env.PONDER_RPC_URL_5003_3!],
    },
  },
  contracts: {
    CoreCmETH: {
      chain: "mantleSepolia",
      abi: CoreAbi,
      address: coreMarkets.cmETH,
      startBlock: 32683491,
    },
    CoreMETH: {
      chain: "mantleSepolia",
      abi: CoreAbi,
      address: coreMarkets.mETH,
      startBlock: 32683491,
    },
    CoreUSDT: {
      chain: "mantleSepolia",
      abi: CoreAbi,
      address: coreMarkets.USDT,
      startBlock: 32683491,
    },
    CoreUSDC: {
      chain: "mantleSepolia",
      abi: CoreAbi,
      address: coreMarkets.USDC,
      startBlock: 32683491,
    },

    FeeCollector: {
      chain: "mantleSepolia",
      abi: FeeCollectorAbi,
      address: feeCollector.proxy,
      startBlock: 32683491,
    },
  },
});
