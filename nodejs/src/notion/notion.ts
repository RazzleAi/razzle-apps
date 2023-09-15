import { Client } from '@notionhq/client'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import {
  Action,
  ActionParam,
  CallDetails,
  RazzleResponse,
  RazzleText,
} from '@razzledotai/sdk'
export class Notion {
  client: Client
  constructor() {
    this.client = new Client({ auth: process.env.NOTION_API_KEY })
  }

  @Action({
    name: 'search',
    description: 'Search for content in Notion',
  })
  async search(
    @ActionParam({
      name: 'searchQuery',
      description: 'The search query to use when searching notion',
    })
    searchQuery: string
  ) {
    const search = await this.client.search({
      query: searchQuery,
      filter: {
        property: 'object',
        value: 'page',
      },
    })

    return new RazzleResponse({
      data: search.results.slice(0, 5),
    })
  }

  @Action({
    name: 'createPage',
    description: 'Create a new page in Notion',
  })
  async createPage(
    @ActionParam({
      name: 'title',
      description: 'The title of the page to create',
    })
    title: string,
    @ActionParam({
      name: 'content',
      description: 'The content of the page to create',
    })
    content: string
  ) {
    try {
      const newPage = await this.client.pages.create({
        parent: {
          type: 'page_id',
          page_id: '7e0f4719-4b24-414e-a62e-e5d6422df7b6',
        },
        properties: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        children: [
          {
            object: 'block',
            heading_2: {
              rich_text: [
                {
                  text: {
                    content,
                  },
                },
              ],
            },
          },
        ],
      })

      return new RazzleResponse({
        ui: new RazzleText({
          text: `Page created with id ${newPage.id}`,
        }),
        data: {
          pageId: newPage.id,
          message: `Page created with id ${newPage.id}`,
        },
      })
    } catch (e) {
      console.log(e)
      return new RazzleResponse({
        ui: new RazzleText({
          text: `Error creating page: ${e}`,
        }),
        data: { msg: `Error creating page: ${e}` },
      })
    }
  }

  @Action({
    name: 'updatePage',
    description: 'updates the content of a page',
  })
  async updatePage(
    @ActionParam({
      name: 'pageId',
      description: 'The id of the page to update',
    })
    pageId: string,

    @ActionParam({
      name: 'content',
      description: 'The content of the page to create',
    })
    content: string,
    callDetails: CallDetails
  ) {
    try {
      const page = (await this.client.pages.retrieve({
        page_id: pageId,
      })) as PageObjectResponse

      // @ts-ignore
      const title = page.properties.title.title[0].plain_text
      await this.client.pages.update({
        page_id: pageId,
        archived: true,
      })

      const response = await this.createPage(title, content)

      return new RazzleResponse({
        data: {
          message: 'Page update successfull',
          id: response.data.pageId,
        },
      })
    } catch (e) {
      console.log(e)
      return new RazzleResponse({
        ui: new RazzleText({
          text: `Error updating page: ${e}`,
        }),
        data: { msg: `Error updating page: ${e}` },
      })
    }
  }
}
