import { Injectable } from '@nestjs/common'
import { getJson } from 'serpapi'
import { Page, SearchResult } from './types';

@Injectable()
export class SerpApiService {


  async getSearchResults(query, page = 1): Promise<Page<SearchResult>> {
    const response = await getJson("google", {
      api_key: '57ffff631d23b4cb4d7cf8f70319afbe02712ec3a5096fa663b0b683bb7d8539', // TODO: move to config
      q: query,
      start: (page - 1) * 10,
    });

    if (response && response.organic_results && response.organic_results.length) {
      const results = response.organic_results.map((result, index) => {
        return {
          position: result.position,
          title: result.title,
          link: result.link,
          snippet: result.snippet,
          description: result.about_this_result?.source?.description,
        };
      });

      return {
        items: results,
        total: response.search_information.total_results,
        page: page,
        pageSize: 10,
      };
    }

    return {
      items: [],
      total: 0,
      page: page,
      pageSize: 10,
    }
  }


}
