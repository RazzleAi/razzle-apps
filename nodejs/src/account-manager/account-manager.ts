import {
  Action,
  ActionParam,
  CallDetails,
  RazzleResponse,
} from '@razzledotai/sdk'
import {
  RazzleColumn,
  RazzleContainer,
  RazzleCustomList,
  RazzleCustomListItem,
  RazzleImage,
  RazzleLink,
  RazzleRow,
  RazzleText,
  WidgetPadding,
} from '@razzledotai/sdk'
import {
  getAccountMemberships,
  inviteUserToAccount,
  removeUserFromAccount as removeUser,
} from './api'
import { AccountMembership } from './types'

export class AccountManager {
  constructor() {}

  @Action({
    name: 'inviteUsers',
    description: 'Invite user to an account',
  })
  async inviteUsers(
    @ActionParam({name: 'email', description: 'The email of the user to invite'}) email: string,
    callDetails: CallDetails
  ) {
    const accountId = callDetails.accountId
    const userId = callDetails.userId

    await inviteUserToAccount(accountId, userId, email)
    return new RazzleResponse({
      ui: new RazzleText({ text: `Invitation sent to ${email}` }),
    })
  }

  @Action({
    name: 'getUsersInAccount',
    description: 'Get all users in this account',
  })
  async getUsersInAccount(callDetails: CallDetails) {
    const accountId = callDetails.accountId
    const userId = callDetails.userId

    const memberships = await getAccountMemberships(accountId)
    const ownerId = memberships.find((m) => m.isOwner)?.userId
    const isCurrUserOwner = ownerId === userId

    console.debug(`Memberships for account: ${JSON.stringify(memberships)}`)
    return new RazzleResponse({
      ui: new RazzleCustomList({
        title: 'Users in Account',
        items: memberships.map(
          (membership: AccountMembership) =>
            new RazzleCustomListItem({
              content: new RazzleContainer({
                padding: new WidgetPadding({ bottom: 10 }),
                body: new RazzleColumn({
                  children: [
                    new RazzleContainer({
                      padding: WidgetPadding.symmetric({
                        horizontal: 10,
                        vertical: 5,
                      }),
                      body: new RazzleRow({
                        mainAxisAlignment: 'start',
                        crossAxisAlignment: 'center',
                        children: [
                          new RazzleImage({
                            url: membership.user?.profilePictureUrl,
                            circular: true,
                          }),
                          new RazzleText({
                            text: membership.user?.username,
                            textSize: 'small',
                            padding: WidgetPadding.symmetric({
                              vertical: 10,
                              horizontal: 10,
                            }),
                          }),
                        ],
                      }),
                    }),
                    isCurrUserOwner && membership.userId !== userId
                      ? new RazzleContainer({
                          padding: WidgetPadding.symmetric({ horizontal: 10 }),
                          body: new RazzleRow({
                            children: [
                              new RazzleLink({
                                action: {
                                  label: 'Remove',
                                  action: 'removeUserFromAccount',
                                  args: [membership.userId],
                                },
                                textSize: 'xsmall',
                              }),
                            ],
                          }),
                        })
                      : new RazzleRow({ children: [] }),
                  ],
                }),
              }),
            })
        ),
      }),
    })
  }

  @Action({
    name: 'removeUserFromAccount',
    description: 'Remove a user from this account',
    stealth: true,
  })
  async removeUserFromAccount(
    @ActionParam({name: 'userId', description: 'The id of the user to remove'}) userId: string,
    callDetails: CallDetails
  ) {
    const deleted = await removeUser(callDetails.accountId, userId)
    if (deleted) {
      return new RazzleResponse({
        ui: new RazzleText({ text: `User removed from account` }),
      })
    }

    return new RazzleResponse({
      ui: new RazzleText({ text: `User not found in account` }),
    })
  }
}
