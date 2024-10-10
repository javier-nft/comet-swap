import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import {
  apiTimeout,
  chainWrappedTokenId,
  dexAggregatorDynamicRoutingEnabled,
  dexAggregatorUrl,
  nativeChainCoin
} from 'config';

export interface DexAggregatorSwapPool {
  name: string;
  sc_address: string;
  tokens_in: string[];
  tokens_out: string[];
  type: string;
}

export interface DexAggregatorSwapRouteHop {
  pool: DexAggregatorSwapPool;
  token_in: string;
  token_out: string;
}

export interface DexAggregatorSwapRoute {
  hops: DexAggregatorSwapRouteHop[];
  token_in: string;
  token_out: string;
}

export interface DexAggregatorDynamicRouteSwapEvaluationOut {
  amount_in: string;
  estimated_gas: string;
  estimated_tx_fee_egld: string;
  human_amount_in: number;
  net_amount_out: string;
  net_human_amount_out: number;
  evals: DexAggregatorStaticRouteSwapEvaluationOut[];
  rate: number;
  rate2: number;
  amounts_and_routes_payload: string;
}

export interface DexAggregatorStaticRouteSwapEvaluationOut {
  amount_in: string;
  estimated_gas: string;
  estimated_tx_fee_egld: string;
  fee_amount: string;
  fee_token?: string;
  human_amount_in: number;
  net_amount_out: string;
  net_human_amount_out: number;
  route: DexAggregatorSwapRoute;
  route_payload: string;
  rate: number;
  rate2: number;
  slippage_percent: number;
  theorical_amount_out: string;
  theorical_human_amount_out: number;
  amounts_and_routes_payload: string;
}

export interface DexAggregatorSwapEvaluationOut {
  dynamic?: DexAggregatorDynamicRouteSwapEvaluationOut;
  static?: DexAggregatorStaticRouteSwapEvaluationOut;
}

export const estimateAmountOut = async (
  tokenIn: string,
  amountIn: BigNumber,
  tokenOut: string
) => {
  if (tokenIn === nativeChainCoin) {
    tokenIn = chainWrappedTokenId;
  }

  const url = `${dexAggregatorUrl}/evaluate?token_in=${tokenIn}&token_out=${tokenOut}&amount_in=${amountIn.toFixed(
    0
  )}&with_dyn_routing=${dexAggregatorDynamicRoutingEnabled}`;

  try {
    const { data, status } = await axios.get<DexAggregatorSwapEvaluationOut>(
      url,
      {
        timeout: apiTimeout
      }
    );

    if (status !== 200) return null;

    return data;
  } catch {
    return null;
  }
};
