import { Module, OnModuleInit } from '@nestjs/common'

import { Razzle } from '@razzledotai/sdk'
import { AccountService } from './account.service'
import { AccountManager } from './account-manager'

@Module({
  imports: [],
  controllers: [],
  providers: [AccountService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly accountService: AccountService) {}

  onModuleInit() {
    Razzle.app({
      appId: process.env.RAZZLE_APP_ID,
      apiKey: process.env.RAZZLE_API_KEY,
      modules: [{ module: AccountManager, deps: [this.accountService] }],
    })
  }
}
