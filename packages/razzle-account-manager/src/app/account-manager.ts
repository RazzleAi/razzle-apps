import {
  Action,
  ActionParam,
  CallDetails,
  RazzleResponse,
} from '@razzledotai/sdk'
import { AccountService } from './account.service'
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
} from '@razzledotai/widgets'

export class AccountManager {
  constructor(private readonly accountService: AccountService) {}

  @Action({
    name: 'inviteUsers',
    description: 'Invite user to an account',
  })
  async inviteUsers(
    @ActionParam('email') email: string,
    callDetails: CallDetails
  ) {
    const accountId = callDetails.accountId
    const userId = callDetails.userId

    const accountUser = await this.accountService.getAccountById(
      accountId,
      userId
    )
    if (!accountUser) {
      console.error(
        `Account User not found, Account ID: ` +
          accountId +
          `, User ID: ` +
          userId
      )
      return new RazzleResponse({
        ui: new RazzleText({ text: `Account User not found` }),
      })
    }

    const isOwner = accountUser.owner.id = accountUser.id
    if (!isOwner) {
      console.error(
        `Account User ${accountUser} is not the owner of the account`
      )
      return new RazzleResponse({
        ui: new RazzleText({
          text: `You do not have permission to invite users to this account`,
        }),
      })
    }

    this.accountService.inviteUserToAccount(accountId, userId, email)
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
    const account = await this.accountService.getAccountById(accountId, userId)
    const accountOwner = account.owner

    const usersInAccount = await this.accountService.getUsersInAccount(
      accountId
    )
    console.debug(`Users in account: ${JSON.stringify(usersInAccount)}`)
    return new RazzleResponse({
      ui: new RazzleCustomList({
        title: 'Users in Account',
        items: usersInAccount.map(
          (user) =>
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
                            url: user.profilePictureUrl,
                            circular: true,
                          }),
                          new RazzleText({
                            text: user.email,
                            textSize: 'small',
                            padding: WidgetPadding.symmetric({
                              vertical: 10,
                              horizontal: 10,
                            }),
                          }),
                        ],
                      }),
                    }),
                    user.id !== accountOwner.id
                      ? new RazzleContainer({
                          padding: WidgetPadding.symmetric({ horizontal: 10 }),
                          body: new RazzleRow({
                            children: [
                              new RazzleLink({
                                action: {
                                  label: 'Remove',
                                  action: 'removeUserFromAccount',
                                  args: [user.id],
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
    @ActionParam('userId') userId: string,
    callDetails: CallDetails
  ) {
    const deleted = await this.accountService.removeUserFromAccount(
      userId,
      callDetails.accountId
    )
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
