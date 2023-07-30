import { calendar_v3 } from '@googleapis/calendar'
import { google } from 'googleapis'
import {
  Action,
  ActionParam,
  CallDetails,
  RazzleColumn,
  RazzleContainer,
  RazzleCustomList,
  RazzleCustomListItem,
  RazzleLink,
  RazzleList,
  RazzleResponse,
  RazzleRow,
  RazzleText,
  WidgetPadding,
} from '@razzledotai/sdk'
import { OAuth2Client, Credentials } from 'google-auth-library'
import express from 'express'
import { DateTime } from 'luxon'
import { GCRepo } from './google-calendar-credential.repo'
import { GCalendarRepo, GCalendar } from './google-calendar.repo'

export class GoogleCalendar {
  private readonly oauth2Client = this.getGoogleOAuth2Client()

  constructor(
    private readonly app: express.Application,
    private readonly repo: GCRepo,
    private readonly calendarRepo: GCalendarRepo
  ) {
    this.setupOauthRoute()
  }

  @Action({
    name: 'listCalendars',
    description: 'Lists the calendars that a users has on google calendar',
  })
  async listCalendars(callDetails: CallDetails) {
    const renderCalendars = (calendars: GCalendar[]): RazzleResponse => {
      return new RazzleResponse({
        ui: new RazzleList({
          title: 'Calendars',
          items: calendars.map((item) => ({
            text: item.primary ? `${item.summary} (primary)` : item.summary,
          })),
        }),
        data: {
          calendars: calendars,
        },
      })
    }

    const dbCalendars = await this.calendarRepo.getCalendars(callDetails.userId)
    if (dbCalendars && dbCalendars.length > 0) {
      return renderCalendars(dbCalendars)
    }

    const credentialsOrAuthUrl = await this.getUserAuth(callDetails)

    if (credentialsOrAuthUrl.authUrl) {
      return this.sendAuthUrlBackToUser(credentialsOrAuthUrl.authUrl)
    }

    return new RazzleResponse({
      ui: new RazzleText({ text: 'No calendars found' }),
      data: {
        err: 'unknown error occured',
      },
    })
  }

  @Action({
    name: 'listEvents',
    description: 'Lists the events on a calendar',
  })
  async listEvents(
    @ActionParam({
      name: 'fromDate',
      description:
        "Lower bound (inclusive) for an event's start time to filter by",
    })
    fromDate: string,
    @ActionParam({
      name: 'toDate',
      description:
        "Upper bound (inclusive) for an event's start time to filter by",
    })
    toDate: string,
    callDetails: CallDetails
  ) {
    const credentialsOrAuthUrl = await this.getUserAuth(callDetails)
    if (credentialsOrAuthUrl.authUrl) {
      return this.sendAuthUrlBackToUser(credentialsOrAuthUrl.authUrl)
    }

    const primaryCalendar = await this.getPrimaryCalendarFromDB(
      callDetails.userId
    )
    if (!primaryCalendar) {
      return new RazzleResponse({
        error: {
          message: 'No primary calendar found',
        },
      })
    }

    const from = DateTime.fromISO(fromDate).toISO()
    const to = DateTime.fromISO(toDate).toISO()
    const calendarClient = this.getCalendarClient(
      credentialsOrAuthUrl.credentials
    )

    let response

    try {
      response = await calendarClient.events.list({
        calendarId: primaryCalendar.id,
        timeMin: from,
        timeMax: to,
      })
    } catch (error) {
      console.error(error)
      return new RazzleResponse({
        data: {
          err: error?.errors?.[0]?.message,
        },
      })
    }

    return new RazzleResponse({
      data: response.data.items.map((i) => ({
        organizer: i.organizer,
        summary: i.summary,
        start: i.start,
        end: i.end,
      })),
      ui: new RazzleCustomList({
        title: 'Here are the events on your calendar',
        items: response.data.items
          .filter((item) => item.status !== 'cancelled')
          .map((item) => {
            return new RazzleCustomListItem({
              content: new RazzleColumn({
                spacing: 1,
                children: [
                  new RazzleText({
                    text: item.summary,
                    textWeight: 'semibold',
                    padding: WidgetPadding.all(0),
                  }),
                  new RazzleText({
                    text: `${DateTime.fromISO(
                      item.start.dateTime
                    ).toLocaleString(
                      DateTime.DATETIME_FULL
                    )} - ${DateTime.fromISO(item.end.dateTime).toLocaleString(
                      DateTime.DATETIME_FULL
                    )}`,
                    textColor: '#aaa',
                    textSize: 'small',
                    padding: WidgetPadding.all(0),
                  }),
                  new RazzleRow({
                    spacing: 5,
                    mainAxisAlignment: 'start',
                    children: [
                      new RazzleLink({
                        action: {
                          type: 'URL',
                          action: item.htmlLink,
                          label: 'View Event',
                        },
                      }),
                      !!item.location && this.isUrl(item.location)
                        ? new RazzleLink({
                            action: {
                              type: 'URL',
                              action: item.location,
                              label: 'Join Meeting',
                            },
                          })
                        : new RazzleContainer(),
                    ],
                  }),
                ],
              }),
            })
          }),
      }),
    })
  }

  @Action({
    name: 'createEvent',
    description: 'Creates an event on a calendar',
  })
  async createEvent(
    @ActionParam({
      name: 'startTime',
      description: 'The start time of the event',
    })
    fromDate: string,
    @ActionParam({
      name: 'end',
      description: 'The end time of the event',
    })
    toDate: string,
    callDetails: CallDetails
  ) {
    const credentialsOrAuthUrl = await this.getUserAuth(callDetails)
    if (credentialsOrAuthUrl.authUrl) {
      return this.sendAuthUrlBackToUser(credentialsOrAuthUrl.authUrl)
    }

    const primaryCalendar = await this.getPrimaryCalendarFromDB(
      callDetails.userId
    )
    if (!primaryCalendar) {
      return new RazzleResponse({
        error: {
          message: 'No primary calendar found',
        },
      })
    }

    const from = DateTime.fromISO(fromDate).toISO()
    const to = DateTime.fromISO(toDate).toISO()
    const calendarClient = this.getCalendarClient(
      credentialsOrAuthUrl.credentials
    )

    let response
    try {
      response = await calendarClient.events.insert({
        calendarId: primaryCalendar.id,
        requestBody: {
          summary: 'New Event',
          start: {
            dateTime: from,
          },
          end: {
            dateTime: to,
          },
        },
      })
    } catch (error) {
      console.error(error)
      return new RazzleResponse({
        data: {
          err: error?.errors?.[0]?.message,
        },
      })
    }
  }

  private async getPrimaryCalendarFromDB(
    userId: string
  ): Promise<GCalendar | null> {
    const calendars = await this.calendarRepo.getCalendars(userId)
    const primaryCalendar = calendars.find((item) => item.primary)
    if (!primaryCalendar) {
      console.error('No primary calendar found')
      return null
    }
    return primaryCalendar
  }

  private getCalendarClient(credentials: Credentials): calendar_v3.Calendar {
    this.oauth2Client.setCredentials(credentials)
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
    return calendar
  }

  private async getUserAuth(
    callDetails: CallDetails
  ): Promise<{ credentials?: Credentials; authUrl?: string }> {
    const credentials = await this.hasCredentials(callDetails)

    if (!credentials) {
      return { authUrl: await this.getGoogleOAuth2Url(callDetails) }
    }

    return { credentials }
  }

  private async hasCredentials(callDetails: CallDetails) {
    const { userId } = callDetails
    const credResp = await this.repo.getCredentials(userId)
    if (!credResp) {
      return null
    }
    return credResp.credentials
  }

  private getGoogleOAuth2Client(): OAuth2Client {
    const oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
      redirectUri: `${process.env.GOOGLE_CALENDAR_REDIRECT_URI_HOST}/oauth2callback`,
    })
    return oauth2Client
  }

  private sendAuthUrlBackToUser(authUrl: string) {
    return new RazzleResponse({
      ui: new RazzleLink({
        action: {
          type: 'URL',
          action: authUrl,
          label: 'Click here to authorize Google Calendar',
        },
      }),
      data: {
        authUrl: authUrl,
        message: `Please authorize Google Calendar using ${authUrl}`,
      },
    })
  }

  private async getGoogleOAuth2Url(callDetails: CallDetails): Promise<string> {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.events.readonly',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.settings.readonly',
      ],
      state: `userId=${callDetails.userId}&accountId=${callDetails.accountId}&chatId=${callDetails.chatId}`,
    })
    return authUrl
  }

  private async getCredentials(code: string): Promise<Credentials> {
    const token = await this.oauth2Client.getToken(code)
    return token.tokens
  }

  private async setupOauthRoute() {
    this.app.get('/oauth2callback', async (req, res) => {
      console.debug('oauth2callback', req.query)
      const state = req.query.state as string
      // decode query string to map
      const stateMap = new Map<string, string>()
      state.split('&').forEach((kv) => {
        const [k, v] = kv.split('=')
        stateMap.set(k, v)
      })
      const userId = stateMap.get('userId')
      const code = req.query.code
      const credentials = await this.getCredentials(code as string)
      console.debug('oauth2callback', credentials)
      this.saveCredentialsAndCalendars(userId, credentials)

      res.setHeader('Content-Type', 'text/html')
      res.send(`
        <html>
        <script type="text/javascript">
        window.close()
        </script>
        </html>
        `)
    })
  }

  private async saveCredentialsAndCalendars(
    userId: string,
    credentials: Credentials
  ) {
    const calendar = this.getCalendarClient(credentials)
    const calendars = await calendar.calendarList.list()
    await this.repo.saveCredentials(userId, credentials)
    const dbCalendars: GCalendar[] = calendars.data.items.map((item) => ({
      id: item.id,
      accessRole: item.accessRole,
      summary: item.summary,
      selected: item.selected,
      primary: item.primary,
    }))
    await this.calendarRepo.saveCalendars(userId, dbCalendars)
  }

  private isUrl(str: string) {
    try {
      new URL(str)
      return true
    } catch (_) {
      return false
    }
  }
}
