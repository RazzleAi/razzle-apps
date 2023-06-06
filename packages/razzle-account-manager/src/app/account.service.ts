import { Injectable } from '@nestjs/common'
import { AccountWithOwner, User, UserAccount } from './types'
import { API } from './api'

@Injectable()
export class AccountService {
  async getAccountById(
    accountId: string,
    userId: string
  ): Promise<AccountWithOwner | null> {
    return await API.get<AccountWithOwner>(
      `/account/internal/user-accounts/${accountId}/${userId}`
    )
  }

  async getUserAccount(
    accountId: string,
    userId: string
  ): Promise<UserAccount | null> {
    console.debug(`Getting user account for ${accountId} and ${userId}`)
    return await API.get<UserAccount>(
      `/account/internal/${accountId}/users/${userId}`
    )
  }

  async inviteUserToAccount(
    accountId: string,
    userId: string,
    emailToInvite: string
  ): Promise<void> {
    return await API.post<void>(
      `/account/internal/${accountId}/users/${userId}/invitations?email=${emailToInvite}`,
      {}
    )
  }

  // Get all users in an account
  getUsersInAccount(accountId: string): Promise<User[]> {
    return API.get<User[]>(`/account/internal/${accountId}/all-users`)
  }

  removeUserFromAccount(accountId: string, userId: string): Promise<boolean> {
    return API.delete<boolean>(`/account/internal/${accountId}/users/${userId}`)
  }
}
