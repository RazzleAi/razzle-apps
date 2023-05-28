import { Injectable } from '@nestjs/common'
import { getJson } from 'serpapi'
import { Page, SearchResult } from './types'
import natural from 'natural'
import fetch from 'node-fetch'


import { convert } from 'html-to-text'
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


  async getNewsSearchResults(query, page = 1): Promise<Page<SearchResult>> {
    const response = await getJson("google", {
      api_key: '57ffff631d23b4cb4d7cf8f70319afbe02712ec3a5096fa663b0b683bb7d8539', // TODO: move to config
      q: query,
      tbm: "nws",
      start: (page - 1) * 10,
    });

    if (response && response.news_results && response.news_results.length) {
      const results = response.news_results.map((result,) => {
        return {
          position: result.position,
          title: result.title,
          link: result.link,
          snippet: result.snippet,
          source: result.source,
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


  async fetchAndParse(url: string): Promise<string> {
    const response = await fetch(url);
    const html = await response.text();
    const text = convert(html);
    return text;
  }


  async analyze(url: string, phrases: string[]): Promise<Map<string, number>> {
    const tfidf = new natural.TfIdf();
    const text = await this.fetchAndParse(url);
    tfidf.addDocument(text);

    const result = new Map<string, number>();
    for (const phrase of phrases) {
      const measure = tfidf.tfidf(phrase, 0);
      result.set(phrase, measure);
    }

    return Promise.resolve(result);
  }


  async analyzeWebPage(url: string, ...phrases: string[]): Promise<Map<string, number>> {
    const text = await this.fetchAndParse(url);
    return this.analyze(text, phrases);
  }


}

