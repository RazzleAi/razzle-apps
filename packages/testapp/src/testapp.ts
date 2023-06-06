import { Action, ActionParam, CallDetails, RazzleResponse } from "@razzledotai/sdk"

export class TestApp {
    constructor() {}
    @Action({
        name: 'createInvoice',
        description: 'Create an invoice',
      })
      async createInvoice() {
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
      async addItemToInvoice(
        @ActionParam('invoiceId') invoiceId: string,
        @ActionParam('item') item: string,
        @ActionParam('price') price: number, callDetails: CallDetails
      ) {
        return new RazzleResponse({
          data: `Added ${item} to invoice ${invoiceId} with price ${price}`,
        })
      }
    
      @Action({
        name: 'sendInvoice',
        description: 'Send an invoice to a receipient',
      })
      async sendInvoice(
        @ActionParam('invoiceId') invoiceId: string,
        @ActionParam('receipientEmail') receipientEmail: string,
        callDetails: CallDetails
      ) {
        return new RazzleResponse({
          data: `Sent invoice ${invoiceId} to ${receipientEmail}`,
        })
      }
}