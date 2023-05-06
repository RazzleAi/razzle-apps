
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
      // pagination: {
      //   pageNumber: callDetails.pagination.pageNumber,
      //   pageSize: callDetails.pagination.pageSize,
      //   totalCount: result.total,
      // },
      // new RazzleLink({
      //   action: {
      //     type: 'URL',
      //     label: item.title,
      //     action: item.link,
      //   },
      // })
      data: result,
      ui: new RazzleCustomList({
        title: 'Search Results',
        divider: true,
        items: result.items.map((item) => {
          return new RazzleCustomListItem({
            content: new RazzleContainer({
              body: new RazzleColumn({
                children: [
                  new RazzleLink({
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
    })
  }


}
