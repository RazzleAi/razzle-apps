import { Db, MongoClient } from 'mongodb'

export function iniDb(): Db {
  const uri = process.env.DATABASE_URL
  const client = new MongoClient(uri)

  return client.db()
}
