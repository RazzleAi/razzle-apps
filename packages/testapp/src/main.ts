import { Razzle } from '@razzledotai/sdk'
import { TestApp } from './testapp'

Razzle.app({
  appId: process.env.RAZZLE_APP_ID,
  apiKey: process.env.RAZZLE_API_KEY,
  modules: [{ module: TestApp, deps: [] }],
})
