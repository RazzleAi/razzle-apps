import { Db } from 'mongodb'
import { Repo } from './repo'


export class GCRepo extends Repo {
  constructor(db: Db) {
    super(db, 'google-calendar.access-tokens')
  }

  async saveCredentials(userId: string, credentials: any) {
    await this.saveDocument({ userId, credentials })
  }

  async getCredentials(userId: string): Promise<any> {
    const document = await this.collection.findOne({ userId })
    return document
  }


}
