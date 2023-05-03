import { Action } from '@razzledotai/sdk'
import { SerpApiService } from './serp-api.service'
import { getJson } from 'serpapi'

export class SerpAPI {
  constructor(private readonly serpApiService: SerpApiService) {}

  @Action({
    name: 'searchGoogle',
    description: 'Search google for a query',
  })
  async search(query) {
    const response = await getJson("google", {
        api_key: process.env.SERP_API_KEY, // Get your API_KEY from https://serpapi.com/manage-api-key
        q: query,
        location: "Austin, Texas",
      });
      console.log(response);
  }
}
