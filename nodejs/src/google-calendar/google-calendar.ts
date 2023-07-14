import { calendar, calendar_v3 } from '@googleapis/calendar'
import { google } from 'googleapis'
import {
  Action,
  CallDetails,
  RazzleContainer,
  RazzleLink,
  RazzleList,
  RazzleResponse,
  RazzleText,
} from '@razzledotai/sdk'
import { OAuth2Client, Credentials } from 'google-auth-library'
import express from 'express'

export class GoogleCalendar {
  private readonly oauthDB = new Map<string, Credentials>()
  private readonly oauth2Client = this.getGoogleOAuth2Client()
  constructor(private readonly app: express.Application) {
    this.setupOauthRoute()
  }

  @Action({
    name: 'testGoogleCalendar',
    description: 'Tests the Google Calendar app',
  })
  async testGoogleCalendar(callDetails: CallDetails) {
    const credentialsOrAuthUrl = await this.getUserAuth(callDetails)

    if (credentialsOrAuthUrl.authUrl) {
      return new RazzleResponse({
        ui: new RazzleLink({
          action: {
            type: 'URL',
            action: credentialsOrAuthUrl.authUrl,
            label: 'Click here to authorize Google Calendar',
          },
        }),
        data: {
          authUrl: credentialsOrAuthUrl.authUrl,
          message: `Please authorize Google Calendar using ${credentialsOrAuthUrl.authUrl}`,
        },
      })
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

  private getCalendarClient(credentials: Credentials): calendar_v3.Calendar {
    this.oauth2Client.setCredentials(credentials)
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
    return calendar
  }

  private async getUserAuth(
    callDetails: CallDetails
  ): Promise<{ credentials?: Credentials; authUrl?: string }> {
    let token: string | undefined

    if (!this.isUserAuthenticated(callDetails)) {
      return { authUrl: await this.getGoogleOAuth2Url(callDetails) }
    }

    const credentials = this.oauthDB.get(callDetails.userId)
    return { credentials }
  }

  private isUserAuthenticated(callDetails: CallDetails) {
    const { userId } = callDetails
    return this.oauthDB.has(userId)
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

  private async getGoogleAccessToken(code: string): Promise<string> {
    const token = await this.oauth2Client.getAccessToken()
    return token.token
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
      this.oauthDB.set(userId, credentials)
      console.debug('oauth2callback', credentials)
      const razzleHost =
        process.env.GOOGLE_CALENDAR_RAZZLE_HOST || 'http://localhost:3001'
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
