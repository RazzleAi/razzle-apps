import {
  Action,
  ActionParam,
  CallDetails,
  RazzleResponse,
} from '@razzledotai/sdk'
import {
  RazzleColumn,
  RazzleContainer,
  RazzleCustomList,
  RazzleCustomListItem,
  RazzleCustomTable,
  RazzleImage,
  RazzleLink,
  RazzleList,
  RazzleRow,
  RazzleTable,
  RazzleText,
  WidgetPadding,
} from '@razzledotai/sdk'

export class WidgetTester {
  @Action({
    name: 'textWidget',
    description: 'Render a text widget',
  })
  textWidget(
    @ActionParam({
      name: 'text',
      description: 'The text to render in the text widget',
    })
    text: string
  ) {
    return new RazzleResponse({
      ui: new RazzleText({ text }),
      data: { text },
    })
  }

  @Action({
    name: 'textWidgetWithPadding',
    description: 'Render a text widget with specified padding',
  })
  textWidgetWithPadding(
    @ActionParam({
      name: 'text',
      description: 'The text to render in the text widget',
    })
    text: string,
    @ActionParam({
      name: 'padding',
      description: 'The amount of padding to apply to the text widget',
    })
    padding: number
  ) {
    return new RazzleResponse({
      ui: new RazzleText({ text, padding: WidgetPadding.all(padding) }),
    })
  }

  @Action({
    name: 'imageWidget',
    description: 'Render an image widget with a url',
  })
  imageWidget(
    @ActionParam({
      name: 'url',
      description: 'The url of the image to render in the image widget',
    })
    url: string
  ) {
    return new RazzleResponse({
      ui: new RazzleImage({
        url: 'https://images.nightcafe.studio/jobs/GA6cmQNzC0eUZpbocsuj/GA6cmQNzC0eUZpbocsuj--1--rn9er.jpg?tr=w-1600,c-at_max',
        width: 100,
        height: 100,
      }),
    })
  }

  @Action({
    name: 'listWidget',
    description: 'Render a list widget',
  })
  listWidget() {
    return new RazzleResponse({
      ui: new RazzleList({
        items: [
          {
            text: 'Item 1',
          },
          {
            text: 'Item 2',
          },
          {
            text: 'Third item',
          },
        ],
      }),
    })
  }

  @Action({
    name: 'titledListWidget',
    description: 'Render a titled list widget',
  })
  titledListWidget() {
    return new RazzleResponse({
      ui: new RazzleList({
        title: 'My List',
        items: [
          {
            text: 'Item 1',
          },
          {
            text: 'Item 2',
          },
          {
            text: 'Third item',
          },
        ],
      }),
    })
  }

  @Action({ name: 'tableWidget', description: 'Render a table widget' })
  tableWidget() {
    return new RazzleResponse({
      ui: new RazzleTable({
        columns: [
          {
            header: 'First Name',
            id: 'firstName',
            width: 30,
          },
          {
            header: 'Last Name',
            id: 'lastName',
            width: 30,
          },
          {
            header: 'Address',
            id: 'address',
          },
        ],
        data: [
          ['John', 'Doe', '123 Main St'],
          ['Jane', 'Doe', '456 Main St'],
          ['John', 'Smith', '789 Main St'],
          ['Jane', 'Smith', '1011 Main St'],
        ],
      }),
    })
  }

  @Action({
    name: 'rowWidget',
    description: 'Render a row widget with spacing',
  })
  rowWidget(
    @ActionParam({
      name: 'spacing',
      description: 'The amount of spacing to apply to the row widget',
    })
    spacing: number
  ) {
    return new RazzleResponse({
      ui: new RazzleRow({
        spacing: spacing,
        mainAxisAlignment: 'start',
        crossAxisAlignment: 'center',
        children: [
          new RazzleText({ text: 'Row Item1' }),
          new RazzleText({ text: 'Row Item2' }),
          new RazzleText({ text: 'Row Item3' }),
        ],
      }),
    })
  }

  @Action({
    name: 'columnWidget',
    description: 'Render a column widget with spacing',
  })
  columnWidget(
    @ActionParam({
      name: 'spacing',
      description: 'The amount of spacing to apply to the column widget',
    })
    spacing: number
  ) {
    return new RazzleResponse({
      ui: new RazzleColumn({
        spacing: spacing,
        mainAxisAlignment: 'start',
        crossAxisAlignment: 'center',
        children: [
          new RazzleText({ text: 'Column Item1' }),
          new RazzleText({ text: 'Column Item2' }),
          new RazzleText({ text: 'Column Item3' }),
        ],
      }),
    })
  }

  @Action({
    name: 'rowsAndColumns',
    description: 'Render rows and columns combined',
  })
  rowsAndColumns() {
    return new RazzleResponse({
      ui: new RazzleColumn({
        mainAxisAlignment: 'start',
        crossAxisAlignment: 'center',
        children: [
          new RazzleRow({
            mainAxisAlignment: 'start',
            crossAxisAlignment: 'center',
            children: [
              new RazzleText({ text: 'Row Item1' }),
              new RazzleColumn({
                children: [
                  new RazzleText({ text: 'Column Item1' }),
                  new RazzleText({ text: 'Column Item2' }),
                  new RazzleText({ text: 'Column Item3' }),
                ],
              }),
              new RazzleText({ text: 'Row Item3' }),
            ],
          }),
        ],
      }),
    })
  }

  @Action({
    name: 'renderContainer',
    description: 'Render a container widget with padding',
  })
  renderContainer(
    @ActionParam({
      name: 'padding',
      description: 'The amount of padding to apply to the container widget',
    })
    padding: number
  ) {
    return new RazzleResponse({
      ui: new RazzleContainer({
        padding: WidgetPadding.all(padding),
        body: new RazzleRow({
          children: [new RazzleText({ text: 'Container Item' })],
        }),
      }),
    })
  }

  @Action({
    name: 'renderCustomList',
    description: 'Render a custom list widget',
  })
  renderCustomList() {
    return new RazzleResponse({
      ui: new RazzleCustomList({
        title: 'My Custom List',
        items: [
          new RazzleCustomListItem({
            content: new RazzleText({ text: 'Item 1' }),
          }),
          new RazzleCustomListItem({
            content: new RazzleText({ text: 'Item 2' }),
          }),
          new RazzleCustomListItem({
            content: new RazzleRow({
              children: [
                new RazzleText({ text: 'Item 3' }),
                new RazzleText({ text: 'Item 4' }),
              ],
            }),
          }),
        ],
      }),
    })
  }

  @Action({
    name: 'renderCustomListWithDivider',
    description: 'Render a custom list widget with a divider',
  })
  renderCustomListWithDivider() {
    return new RazzleResponse({
      ui: new RazzleCustomList({
        title: 'My Custom List',
        items: [
          new RazzleCustomListItem({
            content: new RazzleText({ text: 'Item 1' }),
          }),
          new RazzleCustomListItem({
            content: new RazzleText({ text: 'Item 2' }),
          }),
          new RazzleCustomListItem({
            content: new RazzleRow({
              children: [
                new RazzleText({ text: 'Item 3' }),
                new RazzleText({ text: 'Item 4' }),
              ],
            }),
          }),
        ],
      }),
    })
  }

  @Action({
    name: 'renderCustomTable',
    description: 'Render a custom table widget',
  })
  renderCustomTable() {
    const data = [
      ['John', 'Doe', '123 Main St'],
      ['Jane', 'Doe', '456 Main St'],
      ['John', 'Smith', '789 Main St'],
    ]
    return new RazzleResponse({
      ui: new RazzleCustomTable({
        title: 'My Custom Table',
        columns: [
          {
            header: 'Column one',
            id: '1',
            widthPct: 30,
          },
          {
            header: 'Column two',
            id: '2',
            widthPct: 30,
          },
          {
            header: 'Column three',
            id: '3',
          },
        ],
        builder: (rowIdx, colID, value) => {
          switch (colID) {
            case '3':
              return new RazzleText({ text: value as string })
            default:
              return new RazzleColumn({
                mainAxisAlignment: 'start',
                crossAxisAlignment: 'center',
                children: [
                  new RazzleText({ text: value as string }),
                  new RazzleText({ text: 'Row Item2' }),
                ],
              })
          }
        },
        data: data,
      }),
    })
  }

  @Action({
    name: 'renderLinkWidget',
    description: 'Renders a link widget',
  })
  renderLinkWidgets() {
    return new RazzleResponse({
      ui: new RazzleColumn({
        mainAxisAlignment: 'start',
        crossAxisAlignment: 'center',
        spacing: 10,
        children: [
          new RazzleLink({
            action: {
              action: 'renderContainer',
              label: 'Render Container',
              type: 'RazzleAction',
              args: [],
            },
          }),
          new RazzleLink({
            action: {
              action: 'textWidget',
              label: 'Render Text',
              type: 'RazzleAction',
              args: [
                {
                  name: 'text',
                  type: 'string',
                  value: 'Hello World',
                },
              ],
            },
          }),
          new RazzleLink({
            action: {
              type: 'URL',
              label: 'Svelte Preprocess',
              action: 'https://svelte.dev/docs/svelte-compiler#preprocess',
            },
          }),
        ],
      }),
    })
  }
}
