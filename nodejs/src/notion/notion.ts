import { Client } from '@notionhq/client'
import {
  Action,
  ActionParam,
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
    name: 'createPpage',
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
    content: string,
    @ActionParam({
      name: 'databaseId',
      description:
        'The database in which you want the notion page to be created',
    })
    dbId: string
  ) {
    try {
      const page = await this.client.pages.create({
        parent: {
          database_id: dbId,
          page_id: dbId,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: title,
                },
              },
            ],
          },
          Content: {
            rich_text: [
              {
                text: {
                  content: content,
                },
              },
            ],
          },
        },
      })

      return new RazzleResponse({
        ui: new RazzleText({
          text: `Page created with id ${page.id}`,
        }),
        data: { msg: `Page created with id ${page.id}` },
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
}
