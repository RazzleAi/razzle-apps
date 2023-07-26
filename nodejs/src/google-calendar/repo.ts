import { Collection, Db } from 'mongodb'

export class Repo {
  collection: Collection
  constructor(
    private readonly db: Db,
    private readonly collectionName: string
  ) {
    this.collection = db.collection(collectionName)
  }

  async saveDocument(doc: any) {
    const docToSave = { ...doc, createdAt: new Date(), updatedAt: new Date() }
    await this.collection.insertOne(docToSave)
  }
}
