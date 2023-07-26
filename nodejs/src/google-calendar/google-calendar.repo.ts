import { Db } from 'mongodb'
import { Repo } from './repo'

export type GCalendar = {
  id: string
  summary: string
  selected?: boolean
  accessRole: string
  primary?: boolean
}

export class GCalendarRepo extends Repo {
  constructor(db: Db) {
    super(db, 'google-calendar.calendars')
  }

  async saveCalendars(userId: string, calendars: GCalendar[]) {
    await this.saveDocument({ userId, calendars })
  }

  async getCalendars(userId: string): Promise<GCalendar[]> {
    const result = await this.collection.find({ userId })
    const allCalendars: GCalendar[] = []
    for await (const doc of result) {
      allCalendars.push(...doc.calendars)
    }

    return allCalendars
  }
}
