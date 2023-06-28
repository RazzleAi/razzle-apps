import axios, { AxiosError, AxiosResponse } from 'axios'
import { AccountMembership, ResponseEnvelope } from './types'
axios.defaults.baseURL = process.env.RAZZLE_API_BASE_URL

export async function getAccountMemberships(
  accountId: string
): Promise<AccountMembership[]> {
  try {
    const response = await axios.get<ResponseEnvelope<AccountMembership[]>>(
      `/internal/accounts/${accountId}/memberships`
    )
    return response.data.data
  } catch (err) {
    console.error(err)
  }
}

export async function inviteUserToAccount(
  accountId: string,
  userId: string,
  emailToInvite: string
): Promise<boolean> {
  try {
    const resp = await axios.post<ResponseEnvelope<boolean>>(
      `/internal/accounts/${accountId}/invitations?invitedBy=${userId}&email=${emailToInvite}`,
      {}
    )
    return resp.data.data
  } catch (err) {
    console.error(err)
  }
}

export async function removeUserFromAccount(
  accountId: string,
  userId: string
): Promise<boolean> {
  try {
    const response = await axios.delete<ResponseEnvelope<boolean>>(
      `/internal/accounts/${accountId}/users/${userId}`
    )
    return response.data.data
  } catch (err) {
    console.error(err)
    return false
  }
}
