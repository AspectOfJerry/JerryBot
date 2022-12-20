# JerryBot#9090

### 👋 Welcome to the documentation page!

<br>

# Command list

\*Parameters<br>
&nbsp;&nbsp;&nbsp;&nbsp;? = Optional parameter<br>
&nbsp;&nbsp;&nbsp;&nbsp;@ = User mention<br>
&nbsp;&nbsp;&nbsp;&nbsp;# = Channel mention<br>


\*PL: Permission Level<br>
&nbsp;&nbsp;&nbsp;&nbsp;-1 = Superuser<br>
&nbsp;&nbsp;&nbsp;&nbsp;0 = Highest<br>
&nbsp;&nbsp;&nbsp;&nbsp;3 = Lowest<br>

<br>

## Client

|  PL*  | Command | Parameters* | Description                            |
| :---: | ------- | ----------- | -------------------------------------- |
|   —   | /ping   | —           | Displays latency.                      |
|   3   | /stop   | —           | Stops the bot. Use as **last** resort. |

<br>

## Config

|  PL*  | Command | Parameters* | Description |
| :---: | ------- | ----------- | ----------- |
|   —   | —       | —           | —           |

*Coming soon*

<br>

## Dev

|  PL*  | Command   | Parameters* | Description |
| :---: | --------- | ----------- | ----------- |
|  -1   | /dev stop | —           | —           |

<br>

## Moderation 

|  PL*  | Command    | Parameters*                           | Description                                                        |
| :---: | ---------- | ------------------------------------- | ------------------------------------------------------------------ |
|   1   | /ban       | \<@user\> \<?reason\>                 | Bans a guild member.                                               |
|   2   | /kick      | \<@user\> \<?reason\>                 | Kicks a guild member.                                              |
|   3   | /purge     | \<amount\>                            | Deletes `<amount>` messages from a channel.                        |
|   3   | /slowmode  | \<interval\> \<?channel\> \<?reason\> | Sets the rate limit to `<interval>` seconds in a channel.          |
|   3   | /timeout   | \<@user\> \<duration\> \<?reason\>    | Times out a member for `<duration>`. e.g., 3**s**, 2**m**, 1**h**. |
|   3   | /untimeout | \<@user\> \<?reason\>                 | Removes the time out from a member.                                |

<br>

## Utility

|  PL*  | Command        | Parameters*                      | Description                                                     |
| :---: | -------------- | -------------------------------- | --------------------------------------------------------------- |
|   3   | /disconnect    | \<?@user\> \<?all\>              | Disconnects a member from a channel.                            |
|   3   | /disconnectall | \<?#channel\>                    | Disconnects all members in a channel.                           |
|   —   | /help          | —                                | Displays help.                                                  |
|   —   | /move          | \<#channel\> \<?@user\> \<?all\> | Moves a user to a channel. Optionally move all the users along. |
|   —   | /profile       | \<@user\>                        | Shows information about a user.                                 |
|   —   | /say           | \<message\>                      | Sends `<message>` in a channel.                                 |
|  -1   | /send          | \<@user\> \<message\>            | Talk privately with a guild member through the bot.             |

<br>

### Utility/Math - Subcommands

|  PL*  | Command       | Parameters* | Description |
| :---: | ------------- | ----------- | ----------- |
|   —   | /math average |             |             |

<br>

### Utility/Voice - Subcommands

|  PL*  | Command      | Parameters* | Description                    |
| :---: | ------------ | ----------- | ------------------------------ |
|   3   | /voice deaf  | —           | Deafens the bot.               |
|   —   | /voice join  | —           | Joins the bot in a channel.    |
|   —   | /voice leave | —           | Leaves the bot from a channel. |
|   3   | /voice mute  | —           | Mutes the bot.                 |

<br>

## Other

|  PL*  | Command    | Parameters* | Description                 |
| :---: | ---------- | ----------- | --------------------------- |
|   —   | /tictactoe | —           | Game of tictactoe.          |
|   —   | /typing    | —           | Sends the typing indicator. |

<br>

### Utility/311 - Subcommands (Guild specific)

|  PL*  | Command             | Parameters* | Description                      |
| :---: | ------------------- | ----------- | -------------------------------- |
|   —   | /311 roles          | —           | Self-select roles.               |
|   —   | /311 schedule       | —           | Shows the schedule for a day.    |
|   —   | /311 searchschedule | —           | Full schedule utility tool.      |
|   —   | /311 weather        | —           | Shows the current day's weather. |

<br>

### Utility/quiz - Subcommands (Guild specific)

|  PL*  | Command | Parameters* | Description |
| :---: | ------- | ----------- | ----------- |
|   —   | —       | —           | —           |

*Coming soon*

<br>