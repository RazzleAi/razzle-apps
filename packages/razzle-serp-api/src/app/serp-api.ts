
import {
  Action,
  ActionParam,
  CallDetails,
  RazzleResponse,
} from '@razzledotai/sdk'

import {
  RazzleText,
  RazzleLink,
  RazzleColumn,
  RazzleContainer,
  RazzleCustomList,
  RazzleCustomListItem,
} from '@razzledotai/widgets'

import { SerpApiService } from './serp-api.service'
import { Logger } from '@nestjs/common'


export class SerpAPI {
  constructor(private readonly serpApiService: SerpApiService) { }

  @Action({
    name: 'searchGoogle',
    description: 'Search Google',
    paged: true,
  })
  async search(@ActionParam('query') query, callDetails: CallDetails) {
    Logger.debug('searchGoogle action was invoked with query: ', query)
    const result = await this.serpApiService.getSearchResults(query)
    return new RazzleResponse({
      data: result,
      ui: new RazzleCustomList({
        title: 'Search Results',
        divider: true,
        items: result.items.map((item) => {
          return new RazzleCustomListItem({
            content: new RazzleColumn({
              crossAxisAlignment: 'start',
              children: [
                new RazzleLink({
                  textAlignment: 'left',
                  action: {
                    type: 'URL',
                    label: item.title,
                    action: item.link,
                  },
                }), 

                new RazzleText({
                  text: item.snippet,
                }),
              ]
            })
          })
        })
      })
    })
  }



  @Action({
    name: 'searchNewsWithGoogle',
    description: 'Search News with Google',
    paged: true,
  })
  async searchNews(@ActionParam('query') query, callDetails: CallDetails) {
    Logger.debug('searchGoogle action was invoked with query: ', query)
    const result = await this.serpApiService.getNewsSearchResults(query)
    return new RazzleResponse({
      data: result,
      ui: new RazzleCustomList({
        title: 'News Search Results',
        divider: true,
        items: result.items.map((item) => {
          return new RazzleCustomListItem({
            content: new RazzleColumn({
              crossAxisAlignment: 'start',
              children: [
                new RazzleLink({
                  textAlignment: 'left',
                  action: {
                    type: 'URL',
                    label: item.title,
                    action: item.link,
                  },
                }), 

                new RazzleText({
                  text: item.snippet,
                }),
              ]
            })
          })
        })
      })
    })
  }


  @Action({
    name: 'searchRelatedNewsWithGoogle',
    description: 'Search Related News with Google',
    paged: true,
  })
  async searchRelatedNews(@ActionParam('query') query, @ActionParam('related') checkString, callDetails: CallDetails) {
    Logger.debug('searchGoogle action was invoked with query: ', query)
    const result = await this.serpApiService.getNewsSearchResults(query)
    const matchingResults = []

    for (let i = 0; i < result.items.length; i++) {
      const item = result.items[i];
      const link = item.link
      const relatedMap = await this.serpApiService.analyze(link, [checkString])
      Logger.debug('Link: ' + link + ' RelatedMap: ' + JSON.stringify(Array.from(relatedMap.entries())))

      Array.from(relatedMap.entries()).forEach(([key, value]) => {
        if (value > 2) {
          matchingResults.push(item)
        }
      })
    }

    return new RazzleResponse({
      data: matchingResults,
      ui: new RazzleCustomList({
        title: 'News Search Results',
        divider: true,
        items: matchingResults.map((item) => {
          return new RazzleCustomListItem({
            content: new RazzleColumn({
              crossAxisAlignment: 'start',
              children: [
                new RazzleLink({
                  textAlignment: 'left',
                  action: {
                    type: 'URL',
                    label: item.title,
                    action: item.link,
                  },
                }), 

                new RazzleText({
                  text: item.snippet,
                }),
              ]
            })
          })
        })
      })
    })
  }


}
