import { Razzle } from '@razzledotai/sdk';
import { Summerizer } from './summerizer';

Razzle.app({
  appId: process.env.RAZZLE_APP_ID || '',
  apiKey: process.env.RAZZLE_API_KEY || '',
  modules: [{ module: Summerizer, deps: [] }],
});
