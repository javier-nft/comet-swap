import { EnvironmentsEnum, Token } from 'types';

export * from './sharedConfig';

export const contractAddress =
  'erd1qqqqqqqqqqqqqpgqtmcuh307t6kky677ernjj9ulk64zq74w9l5qxyhdn7';
export const API_URL = 'https://template-api.multiversx.com';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.mainnet;
export const metamaskSnapWalletAddress = 'https://snap-wallet.multiversx.com';

export const nativeChainCoin = 'EGLD';

export const chainWrappedTokenId = 'WEGLD-bd4d79';

export const mxvApiUrl = 'https://api.multiversx.com';

export const dexAggregatorUrl = 'https://agg-api.jexchange.io';

export const dexAggregatorDynamicRoutingEnabled = false;

export const dexAggregatorScAddress =
  'erd1qqqqqqqqqqqqqpgqqjyq5g07fsh7a5wsvc4fugu8n2v9vcer6avsr4s62v';

export const TOKENS: Token[] = [
  { id: nativeChainCoin, decimals: 18 },
  { id: 'COMET-aedeb8', decimals: 18 },
  { id: chainWrappedTokenId, decimals: 18 }
];
