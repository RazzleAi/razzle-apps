import { Razzle } from '@razzledotai/sdk'
import { Amaka } from './amaka'

Razzle.app({
  appId: process.env.RAZZLE_APP_ID,
  apiKey: process.env.RAZZLE_API_KEY,
  modules: [{ module: Amaka, deps: [] }],
})
