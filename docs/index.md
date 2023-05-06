# JerryBot#9090

### 👋 Welcome to the documentation page!

<br>

## Ongoing maintenance

The bot is currently under maintenance and will be available in the next months.
This page may be out of date with the latest features of the bot.

Stay updated at: [https://status.aspectofjerry.dev](https://status.aspectofjerry.dev) and [https://github.com/AspectOfJerry/JerryBot](https://github.com/AspectOfJerry/JerryBot)

<br>

# Command list
  - [Client](#client)
  - [Config](#config)
  - [Moderation](#moderation)
  - [Utility](#utility)
    - [Math](#utilitymath---subcommands)
    - [Random](#utilityrandom---subcommands)
    - [Voice](#utilityvoice---subcommands)
  - [Other](#other)
  - [Sudo](#sudo)
  - [Other (exclusive)](#other-exclusive-commands-guild-specific)

<br>

\*Parameters<br>
&nbsp;&nbsp;&nbsp;&nbsp;? = Optional parameter (|default value)<br>
&nbsp;&nbsp;&nbsp;&nbsp;@ = User mention<br>
&nbsp;&nbsp;&nbsp;&nbsp;# = Channel mention<br>

<br>

\*PL: Permission Levels<br>
&nbsp;&nbsp;&nbsp;&nbsp;-1 = Superuser<br>
&nbsp;&nbsp;&nbsp;&nbsp;0 = None<br>
&nbsp;&nbsp;&nbsp;&nbsp;1 = Highest (usually "Admin")<br>
&nbsp;&nbsp;&nbsp;&nbsp;2 = Higher (usually "Moderator")<br>
&nbsp;&nbsp;&nbsp;&nbsp;3 = Lowest (usually "Staff/Helper")<br>
<br>

## Client

|  PL*  | Command | Parameters* | Description       |
| :---: | ------- | ----------- | ----------------- |
|   —   | /ping   | —           | Displays latency. |

<br>

## Config

|  PL*  | Command       | Parameters* | Description |
| :---: | ------------- | ----------- | ----------- |
|   —   | *coming soon* | —           | —           |

<br>

## Moderation 

|  PL*  | Command    | Parameters*                            | Description                                                       |
| :---: | ---------- | -------------------------------------- | ----------------------------------------------------------------- |
|   1   | /ban       | \<@user> \<?reason>                    | Bans a guild member.                                              |
|   2   | /kick      | \<@user> \<?reason>                    | Kicks a guild member.                                             |
|   3   | /purge     | \<amount>                              | Deletes `<amount>` messages from a channel.                       |
|   3   | /slowmode  | \<interval> \<?#channel\|#> \<?reason> | Sets the rate limit to `<interval>` seconds in a channel.         |
|   3   | /timeout   | \<@user> \<duration> \<?reason>        | Times out a member for `<duration>`. e.g. 3**s**, 2**m**, 1**h**. |
|   3   | /untimeout | \<@user> \<?reason>                    | Removes the time out from a member.                               |

<br>

## Utility

|  PL*  | Command        | Parameters*                               | Description                                                     |
| :---: | -------------- | ----------------------------------------- | --------------------------------------------------------------- |
|   —   | /cvss          | —                                         | Common Vulnerability Scoring System string generator.           |
|   3   | /disconnect    | \<?@user\|@> \<?all\|false>               | Disconnects a member from a channel.                            |
|   3   | /disconnectall | \<?#channel\|#>                           | Disconnects all members in a channel.                           |
|   —   | /help          | —                                         | Displays help.                                                  |
|   3   | /move          | \<#channel> \<?@user\|@> \<?all\|false>   | Moves a user to a channel. Optionally move all the users along. |
|   —   | /profile       | \<@user>                                  | Shows information about a user.                                 |
|   —   | /send          | \<message> <?#channel\|#> <?typing\|true> | Sends `<message>` in a channel.                                 |

<br>

### Utility/math - subcommands

|  PL*  | Command       | Parameters* | Description                               |
| :---: | ------------- | ----------- | ----------------------------------------- |
|   —   | /math average | —           | Calculate the average of rational numbers |

<br>

### Utility/random - subcommands

|  PL*  | Command         | Parameters*             | Description               |
| :---: | --------------- | ----------------------- | ------------------------- |
|   —   | /voice coinflip | —                       | Coinflip! Returns 0 or 1. |
|   —   | /voice number   | \<?min\|0> \<?max\|100> | Random number.            |

<br>

### Utility/voice - subcommands

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

## Sudo

|  PL*  | Command              | Parameters*                       | Description                                                   |
| :---: | -------------------- | --------------------------------- | ------------------------------------------------------------- |
|  -1   | /sudo blacklist      | <@user>                           | Adds a user to the bot's blacklist.                           |
|  -1   | /sudo msg            | \<@user> \<message>               | Talk privately with a guild member through the bot.           |
|  -1   | /sudo nuke           | *coming soon*                     | Nukes a server (protected command).                           |
|  -1   | /sudo presence_clear | —                                 | Clears the bot's presence.                                    |
|  -1   | /sudo presence       | \<type> \<text> \<status> \<?url> | Edits the bot's presence.                                     |
|  -1   | /sudo status         | \<type>                           | Edits the bot's status.                                       |
|  -1   | /sudo stop           | \<?reason> <?heartbeat\|false>    | Stops the bot. Set <?heartbeat> to true to stop the heartbeat |

<br>

## Other exclusive commands (Guild specific)

<br>

### 311 - subcommands

|  PL*  | Command       | Parameters*   | Description                      |
| :---: | ------------- | ------------- | -------------------------------- |
|   —   | /311 roles    | —             | Self-select roles.               |
|   —   | /311 schedule | \<?day\|auto> | Shows the schedule.              |
|   —   | /311 verify   | —             | Identify yourself.               |
|   —   | /311 weather  | —             | Shows the current day's weather. |
