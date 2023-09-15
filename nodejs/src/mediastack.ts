import 'dotenv/config'
import express, { Request, Response } from 'express'
import { Razzle } from '@razzledotai/sdk'
import { Mediastack } from './mediastack/mediastack'

const app = express()

function startMediastack() {
  return new Promise((resolve, reject) => {
    Razzle.app({
      appId: process.env.MEDIASTACK_RAZZLE_AGENT_ID,
      apiKey: process.env.MEDIASTACK_RAZZLE_API_KEY,
      apps: [new Mediastack()],
      // modules: [{ module: Mediastack, deps: [] }],
    })
    console.debug('Mediastack started')
  })
}

function startServer() {
  app.get('/', (req: Request, res: Response) => {
    res.send('OK')
  })

  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`Mediastack agent server running on port ${port}`)
  })
}

startMediastack()
startServer()

// do not exit the process
setInterval(() => {}, 5000)
