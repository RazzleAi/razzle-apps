export interface ResponseEnvelope<T> {
  message: string
  data: T
  errorCode?: number
}

export interface User {
  id: string
  name: string
  authId: string
  email: string
  username: string
  profilePictureUrl?: string
}

export interface Account {
  id: string
  name: string
  domain?: string
  createdByUserId: string
  createdByUser?: User
}

export interface AccountMembership {
  id: string
  accountId: string
  account?: Account
  userId: string
  user?: User
  isOwner: boolean
}
