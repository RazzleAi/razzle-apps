import axios, { AxiosError, AxiosResponse } from 'axios'
import { AccountMembership, ResponseEnvelope } from './types'
axios.defaults.baseURL = process.env.RAZZLE_API_BASE_URL

function getAxiosInstance() {
  const instance = axios.create({
    baseURL: process.env.RAZZLE_API_BASE_URL,
  })
  return instance
}

export async function getAccountMemberships(
  accountId: string
): Promise<AccountMembership[]> {
  const axiosInstance = getAxiosInstance()
  console.debug(`Getting memberships for account: ${accountId}`, {baseUrl: axiosInstance.defaults.baseURL})
  try {
    const response = await axiosInstance.get<ResponseEnvelope<AccountMembership[]>>(
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
  const axiosInstance = getAxiosInstance()
  try {
    const resp = await axiosInstance.post<ResponseEnvelope<boolean>>(
      `/internal/accounts/${accountId}/invitations?userID=${userId}&inviteeEmail=${emailToInvite}`,
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
  const axiosInstance = getAxiosInstance()
  try {
    const response = await axiosInstance.delete<ResponseEnvelope<boolean>>(
      `/internal/accounts/${accountId}/users/${userId}`
    )
    return response.data.data
  } catch (err) {
    console.error(err)
    return false
  }
}
