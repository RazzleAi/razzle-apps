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
import { OAuth2Client } from 'google-auth-library'
import express from 'express'

export class GoogleCalendar {
  private readonly oauthDB = new Map<string, string>()
  constructor(private readonly app: express.Application) {
    this.setupOauthRoute()
  }

  @Action({
    name: 'testGoogleCalendar',
    description: 'Tests the Google Calendar app',
  })
  async testGoogleCalendar(callDetails: CallDetails) {
    const tokenOrAuthUrl = await this.getToken(callDetails)
    if (tokenOrAuthUrl.authUrl) {
      return new RazzleResponse({
        ui: new RazzleLink({
          action: {
            type: 'URL',
            action: tokenOrAuthUrl.authUrl,
            label: 'Click here to authorize Google Calendar',
          },
        }),
      })
    }

    const { refreshToken } = tokenOrAuthUrl
    const calendar = this.getCalendarClient(refreshToken)
    const calendars = await calendar.calendarList.list()

    return new RazzleResponse({
      ui: new RazzleList({
        title: 'Calendars',
        items: calendars.data.items.map((item) => ({
          text: item.id,
        })),
      }),
    })
  }

  private getCalendarClient(refreshToken: string): calendar_v3.Calendar {
    const oauth2Client = this.getGoogleOAuth2Client()
    oauth2Client.setCredentials({ refresh_token: refreshToken })
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    return calendar
  }

  private async getToken(
    callDetails: CallDetails
  ): Promise<{ refreshToken?: string; authUrl?: string }> {
    let token: string | undefined
    if (this.hasGoogleAuthCode(callDetails)) {
      token = await this.getGoogleAuthCode(callDetails)
    }

    if (!token) {
      return { authUrl: await this.getGoogleOAuth2Url(callDetails) }
    }

    // const refreshToken = await this.getGoogleRefreshToken(token)
    return { refreshToken: token }
  }

  private async hasGoogleAuthCode(callDetails: CallDetails) {
    const { userId } = callDetails
    return this.oauthDB.has(userId)
  }

  private async getGoogleAuthCode(
    callDetails: CallDetails
  ): Promise<string | undefined> {
    const { userId } = callDetails
    return this.oauthDB.get(userId)
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
    const client = this.getGoogleOAuth2Client()
    const authUrl = client.generateAuthUrl({
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

  private async getGoogleRefreshToken(code: string): Promise<string> {
    const client = this.getGoogleOAuth2Client()
    const token = await client.getToken(code)
    return token.tokens.refresh_token
  }

  private async getGoogleAccessToken(code: string): Promise<string> {
    const client = this.getGoogleOAuth2Client()
    const token = await client.getAccessToken()
    return token.token
  }

  private async setupOauthRoute() {
    this.app.get('/oauth2callback', async (req, res) => {
      console.debug('oauth2callback', req.query)
      const state = req.query.state
      // decode query string to map
      const stateMap = new Map<string, string>()
      state.split('&').forEach((kv) => {
        const [k, v] = kv.split('=')
        stateMap.set(k, v)
      })
      const userId = stateMap.get('userId')
      const code = req.query.code
      this.oauthDB.set(userId, code as string)
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
