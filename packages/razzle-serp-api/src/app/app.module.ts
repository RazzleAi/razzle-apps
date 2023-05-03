import { Module } from '@nestjs/common';
import { Razzle } from '@razzledotai/sdk';
import { SerpApiService } from './serp-api.service';
import { SerpAPI } from './serp-api';


@Module({
  imports: [],
  controllers: [],
  providers: [SerpApiService],
})
export class AppModule {

  constructor(private readonly serpApiService: SerpApiService) {}

  onModuleInit() {
    Razzle.app({
      appId: process.env.RAZZLE_APP_ID,
      apiKey: process.env.RAZZLE_API_KEY,
      modules: [{ module: SerpAPI, deps: [this.serpApiService] }],
    })
  }
}
