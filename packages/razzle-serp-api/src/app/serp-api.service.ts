import { Injectable } from '@nestjs/common'

@Injectable()
export class SerpApiService {
  getSearchResults(query): Promise<unknown> {
    throw new Error('Method not implemented.')
  }
}
