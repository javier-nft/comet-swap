import { NonFungibleTokenOfAccountOnNetwork } from '@multiversx/sdk-network-providers/out';
import axios from 'axios';
import { apiTimeout, mxvApiUrl } from 'config';

interface FetchAllBalancesType {
  address: string;
  timeout?: number;
}

export const fetchAllTokensBalances = async ({
  address,
  timeout
}: FetchAllBalancesType): Promise<NonFungibleTokenOfAccountOnNetwork[]> => {
  const result: NonFungibleTokenOfAccountOnNetwork[] = [];

  let from = 0;
  const size = 100;

  while (true) {
    const url = `${mxvApiUrl}/accounts/${address}/tokens?from=${from}&size=${size}&includeMetaESDT=false`;

    const { data, status } = await axios.get<any[]>(url, {
      timeout: timeout || apiTimeout
    });

    if (status !== 200) break;

    result.push(
      ...data.map((item: any) =>
        NonFungibleTokenOfAccountOnNetwork.fromApiHttpResponse(item)
      )
    );

    if (data.length < size) break;
    from += size;
  }

  return result;
};
