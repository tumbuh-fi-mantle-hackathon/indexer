import { createConfig } from "ponder";

import { CoreAbi } from "./abis/CoreAbi";
import { FeeCollectorAbi } from "./abis/FeeCollectorAbi";
import { ProtocolAbi } from "./abis/ProtocolAbi";

const coreMarkets = {
  cmETH: "0x32ecd5f7442ae3b4257557d696c6d68722000008" as const,
  mETH: "0x80e6a5e648e97ff1da61c4484d1f41b068c737d3" as const,
  USDT: "0x5c2c580bc9a9f7c7c3e7c768b77c6a34510606cc" as const,
  USDC: "0x6da8058acf83d9ce89610e4c50bd6a35c7c9650b" as const,
};

const feeCollector = {
  proxy: "0x0e8d24364eb713268566a80f7595780376b6dfc7" as const,
};

const protocols = {
  beefy: {
    cmETH: "0x89159c2a782ba2cae40ec25c39a1f38397f1eed5" as const,
    mETH: "0x54ddde71d46409b919b8b29ad52133067b8441fb" as const,
    USDT: "0x5044c96dd29630fac0aa7a4ed8c03c0d0e28aa99" as const,
    USDC: "0xfa699fdc577f6b9538f6b979a327aed38ff27f57" as const,
  },
  compound: {
    cmETH: "0x91f048130c88c1f759a9bdc19883559d3dc275a6" as const,
    mETH: "0xd95d2f7c38bfa2f9d7a618474bc619470f01001f" as const,
    USDT: "0x763a03a3328e475f75ee2dd0329b27f02eed2443" as const,
    USDC: "0x4399b055b86c65bc2e91333d9118f98b974f052c" as const,
  },
  dolomite: {
    cmETH: "0xf8c1cfd46a543efb13305b041fc573550207fa79" as const,
    mETH: "0xc3a0701cebea2b97c460fd147f2eb41d7a286417" as const,
    USDT: "0x33efb6eb5bc283917cd212655685f7efbaab8d52" as const,
    USDC: "0x9d583462ed3aada10ec86ac909d4db27f79866a7" as const,
  },
  initCapital: {
    cmETH: "0x9a53dbaaccbbff2721168673ac7738422bd4d1e9" as const,
    mETH: "0x40199df02e052be29bbf289fbb7717cd0be8ee80" as const,
    USDT: "0xe7ba244c2597ada3e6181577b9758c90f5802f13" as const,
    USDC: "0x0d36746783656989f8d7c03f6bfb80910d32f778" as const,
  },
};

export default createConfig({
  chains: {
    mantleSepolia: {
      id: 5003,
      rpc: [
        process.env.PONDER_RPC_URL_5003!,
        process.env.PONDER_RPC_URL_5003_2!,
        process.env.PONDER_RPC_URL_5003_3!,
      ],
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

    BeefyCmETH: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.beefy.cmETH,
      startBlock: 32683491,
    },
    BeefyMETH: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.beefy.mETH,
      startBlock: 32683491,
    },
    BeefyUSDT: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.beefy.USDT,
      startBlock: 32683491,
    },
    BeefyUSDC: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.beefy.USDC,
      startBlock: 32683491,
    },

    CompoundCmETH: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.compound.cmETH,
      startBlock: 32683491,
    },
    CompoundMETH: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.compound.mETH,
      startBlock: 32683491,
    },
    CompoundUSDT: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.compound.USDT,
      startBlock: 32683491,
    },
    CompoundUSDC: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.compound.USDC,
      startBlock: 32683491,
    },

    DolomiteCmETH: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.dolomite.cmETH,
      startBlock: 32683491,
    },
    DolomiteMETH: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.dolomite.mETH,
      startBlock: 32683491,
    },
    DolomiteUSDT: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.dolomite.USDT,
      startBlock: 32683491,
    },
    DolomiteUSDC: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.dolomite.USDC,
      startBlock: 32683491,
    },

    InitCapitalCmETH: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.initCapital.cmETH,
      startBlock: 32683491,
    },
    InitCapitalMETH: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.initCapital.mETH,
      startBlock: 32683491,
    },
    InitCapitalUSDT: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.initCapital.USDT,
      startBlock: 32683491,
    },
    InitCapitalUSDC: {
      chain: "mantleSepolia",
      abi: ProtocolAbi,
      address: protocols.initCapital.USDC,
      startBlock: 32683491,
    },
  },
});
