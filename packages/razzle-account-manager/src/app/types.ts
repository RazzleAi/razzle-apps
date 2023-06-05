export interface UserAccount {
  id: string
  accountId: string
  userId: string
  isOwner: boolean
}

export interface User {
  id: string
  authUid: string
  email: string
  username: string | null
  profilePictureUrl: string | null
}

export type AccountWithOwner = {
  id: string
  name: string
} & { owner: User }
