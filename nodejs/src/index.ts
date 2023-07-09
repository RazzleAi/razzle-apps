import { Razzle } from '@razzledotai/sdk'
import { AccountManager } from './account-manager/account-manager'
import { SerpApiService } from './serp-api/serp-api.service'
import { SerpAPI } from './serp-api/serp-api'
import { WidgetTester } from './widget-tester/widget-tester'
import 'dotenv/config'
import express, { Request, Response } from 'express'

function startAccountManager() {
  return new Promise((resolve, reject) => {
    Razzle.app({
      appId: process.env.ACCOUNT_MANAGER_RAZZLE_AGENT_ID,
      apiKey: process.env.ACCOUNT_MANAGER_RAZZLE_API_KEY,
      modules: [{ module: AccountManager, deps: [] }],
    })
    console.debug('Account Manager started')
  })
}

function startSerpApi() {
  return new Promise((resolve, reject) => {
    const serpApiService = new SerpApiService()
    Razzle.app({
      appId: process.env.SERP_API_RAZZLE_AGENT_ID,
      apiKey: process.env.SERP_API_RAZZLE_API_KEY,
      modules: [{ module: SerpAPI, deps: [serpApiService] }],
    })
    console.debug('Serp API started')
  })
}

function startWidgetTester() {
  return new Promise((resolve, reject) => {
    Razzle.app({
      appId: process.env.WIDGET_TESTER_RAZZLE_AGENT_ID,
      apiKey: process.env.WIDGET_TESTER_RAZZLE_API_KEY,
      modules: [{ module: WidgetTester, deps: [] }],
    })
    console.debug('Widget Tester started')
  })
}

function startServer() {
  const app = express()
  app.get('/', (req: Request, res: Response) => {
    res.send('OK')
  })

  const port = process.env.PORT || 3003
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

startAccountManager()
startSerpApi()
// startWidgetTester()
startServer()

// do not exit the process
setInterval(() => {}, 5000)
