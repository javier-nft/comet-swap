import { AuthRedirectWrapper, PageWrapper } from 'wrappers';
import { SwapTool } from './SwapTool';

export const Home = () => {
  return (
    <AuthRedirectWrapper requireAuth={false}>
      <PageWrapper>
        <div className='flex flex-col gap-2 sm:flex-row items-center sm:h-full w-full'>
          <div className='flex items-start sm:items-center h-full sm:w-1/2 sm:bg-center'>
            <div className='flex flex-col gap-2 max-w-[70sch] text-center sm:text-left text-xl font-medium md:text-2xl lg:text-3xl'>
              <div>
                <h1 className='text-emerald-600'>Comet Swap</h1>
                <p className='text-gray-400'>
                  The ultimate DEX aggregator
                  <br className='hidden xl:block' />
                  built on the{' '}
                  <a
                    href='https://multiversx.com/'
                    target='_blank'
                    className='text-gray-400 underline decoration-dotted hover:decoration-solid'
                  >
                    MultiversX
                  </a>{' '}
                  blockchain.
                </p>
              </div>
            </div>
          </div>

          <div className='flex items-center h-4/6 bg-contain bg-no-repeat w-fit bg-center'>
            <SwapTool />
          </div>
        </div>
      </PageWrapper>
    </AuthRedirectWrapper>
  );
};
