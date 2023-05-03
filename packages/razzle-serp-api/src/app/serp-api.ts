import { Action } from '@razzledotai/sdk'
import { SerpApiService } from './serp-api.service'

export class SerpAPI {
  constructor(private readonly serpApiService: SerpApiService) {}

  @Action({
    name: 'searchGoogle',
    description: 'Search google for a query',
  })
  async search(query) {
    return this.serpApiService.getSearchResults(query)
  }
}
