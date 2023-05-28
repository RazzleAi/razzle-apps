import { Action, ActionParam, RazzleResponse } from '@razzledotai/sdk'

export class Amaka {
  @Action({
    name: 'createInvoice',
    description: 'Create an invoice',
  })
  createInvoice() {
    return new RazzleResponse({
      data: {
        invoiceId: '1234',
      },
    })
  }

  @Action({
    name: 'addItemToInvoice',
    description: 'Add an item to an invoice',
  })
  addItemToInvoice(
    @ActionParam('invoiceId') invoiceId: string,
    @ActionParam('item') item: string,
    @ActionParam('price') price: number
  ) {
    return new RazzleResponse({
      data: `Added ${item} to invoice ${invoiceId} with price ${price}`,
    })
  }

  @Action({
    name: 'sendInvoice',
    description: 'Send an invoice to a receipient',
  })
  sendInvoice(
    @ActionParam('invoiceId') invoiceId: string,
    @ActionParam('receipientEmail') receipientEmail: string
  ) {
    return new RazzleResponse({
      data: `Sent invoice ${invoiceId} to ${receipientEmail}`,
    })
  }
}
