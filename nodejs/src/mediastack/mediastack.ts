import {
  Action,
  ActionParam,
  RazzleColumn,
  RazzleCustomList,
  RazzleCustomListItem,
  RazzleCustomTable,
  RazzleLink,
  RazzleResponse,
  RazzleRow,
  RazzleText,
  WidgetPadding,
} from '@razzledotai/sdk'
import { getMediaStackNews } from './api'

export class Mediastack {
  @Action({
    name: 'getNews',
    description: 'Get news for a given query',
  })
  async getNews(
    @ActionParam({
      name: 'query',
      description: 'The query to use when searching mediastack',
    })
    query: string
  ) {
    try {
      const response = await getMediaStackNews(query)
      if (!!response.error) {
        throw new Error(response.error.message)
      }

      const data = response.data.slice(0, 5)
      return new RazzleResponse({
        data: data,
        ui: new RazzleCustomList({
          title: query,
          items: data.map((item) => {
            const publishedDate = new Date(
              item.published_at
            ).toLocaleDateString()
            return new RazzleCustomListItem({
              content: new RazzleColumn({
                children: [
                  new RazzleLink({
                    action: {
                      type: 'URL',
                      label: item.title,
                      action: item.url,
                    },
                    padding: WidgetPadding.all(0),
                  }),
                  new RazzleText({
                    text: `Published: ${publishedDate}`,
                    padding: WidgetPadding.all(0),
                    textColor: '#ccc',
                  }),
                ],
              }),
            })
          }),
        }),
      })
    } catch (err) {
      console.error('Failed to get new from mediastack.', err)
      return new RazzleResponse({
        error: {
          message: 'An error occurred while getting the news.',
        },
      })
    }
  }
}
