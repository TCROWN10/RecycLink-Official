import { metaMask } from "wagmi/connectors";

import { http, createConfig } from "wagmi";
import { eduChainTestnet } from "wagmi/chains";

export const config = createConfig({
  chains: [eduChainTestnet],
  connectors: [metaMask()],
  transports: {
    [eduChainTestnet.id]: http(),
  },
});
