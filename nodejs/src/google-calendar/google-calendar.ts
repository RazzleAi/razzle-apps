import { calendar_v3 } from '@googleapis/calendar'
import { google } from 'googleapis'
import {
  Action,
  ActionParam,
  CallDetails,
  RazzleLink,
  RazzleList,
  RazzleResponse,
} from '@razzledotai/sdk'
import { OAuth2Client, Credentials } from 'google-auth-library'
import express from 'express'
import { DateTime } from 'luxon'
import { GCRepo } from './google-calendar.repo'

export class GoogleCalendar {
  private readonly oauth2Client = this.getGoogleOAuth2Client()

  constructor(
    private readonly app: express.Application,
    private readonly repo: GCRepo
  ) {
    this.setupOauthRoute()
  }

  @Action({
    name: 'listCalendars',
    description: 'Lists the calendars that a users has on google calendar',
  })
  async testGoogleCalendar(callDetails: CallDetails) {
    const credentialsOrAuthUrl = await this.getUserAuth(callDetails)

    if (credentialsOrAuthUrl.authUrl) {
      return this.sendAuthUrlBackToUser(credentialsOrAuthUrl.authUrl)
    }

    const calendar = this.getCalendarClient(credentialsOrAuthUrl.credentials)
    const calendars = await calendar.calendarList.list()

    return new RazzleResponse({
      ui: new RazzleList({
        title: 'Calendars',
        items: calendars.data.items.map((item) => ({
          text: item.id,
        })),
      }),
      data: {
        calendars: calendars.data.items,
      },
    })
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

  @Action({
    name: 'listEvents',
    description: 'Lists the events on a calendar',
  })
  async listEvents(
    @ActionParam({
      name: 'calendarId',
      description: 'The id of the calendar to use',
    })
    calendarId: string,
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

    const from = DateTime.fromISO(fromDate).toISO()
    const to = DateTime.fromISO(toDate).toISO()

    const calendar = this.getCalendarClient(credentialsOrAuthUrl.credentials)

    let response

    try {
      response = await calendar.events.list({
        calendarId,
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
      data: response.data.items,
      ui: new RazzleList({
        title: 'Here are the events on your calendar',
        items: response.data.items.map((item) => ({
          text: item.summary,
          actions: [
            {
              label: 'View',
              action: 'viewEvent',
              type: 'RazzleAction',
              args: [item.id],
            },
          ],
        })),
      }),
    })
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
    const { credentials } = await this.repo.getCredentials(userId)
    return credentials
  }

  private getGoogleOAuth2Client(): OAuth2Client {
    const oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
      redirectUri: `${process.env.GOOGLE_CALENDAR_REDIRECT_URI_HOST}/oauth2callback`,
    })
    return oauth2Client
  }

  private async getGoogleOAuth2Url(callDetails: CallDetails): Promise<string> {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'online',
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
      this.repo.saveCredentials(userId, credentials)
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
}
