# JerryBot#9090

### 👋 Welcome to the documentation page!

<br>

# Table of Contents
- [JerryBot#9090](#jerrybot9090)
    - [👋 Welcome to the documentation page!](#-welcome-to-the-documentation-page)
- [Table of Contents](#table-of-contents)
  - [Code](#code)
    - [Scripts](#scripts)
    - [Custom emojis](#custom-emojis)
    - [Even codes (logs)](#even-codes-logs)
  - [Commands](#commands)
  - [Client](#client)
  - [Config](#config)
  - [Moderation](#moderation)
  - [Utility](#utility)
    - [Utility/math - subcommands](#utilitymath---subcommands)
    - [Utility/random - subcommands](#utilityrandom---subcommands)
    - [Utility/voice - subcommands](#utilityvoice---subcommands)
  - [Other](#other)
  - [Sudo](#sudo)
  - [Other exclusive commands (Guild specific)](#other-exclusive-commands-guild-specific)
    - [cra - subcommands](#cra---subcommands)

<br>

## Code

### Scripts

coming soon when i have the patience to write this section

### Custom emojis

```js
const success_emoji = "<:success:1102349129390248017>";
const warn_emoji = "<:warn:1102349145106284584>";
const fail_emoji = "<:fail:1102349156976185435>";
```

### Even codes (logs)

| Hex Code | Code | Event name            |
| -------- | ---- | --------------------- |
| 0x444247 | DBG  | debug                 |
| 0x455252 | ERR  | error                 |
| 0x474241 | GBA  | guildBanAdd           |
| 0x474252 | GBR  | guildBanRemove        |
| 0x475543 | GUC  | guildCreate           |
| 0x475544 | GUD  | guildDelete           |
| 0x474D41 | GMA  | guildMemberAdd        |
| 0x494352 | ICR  | interactionCreate     |
| 0x495257 | IRW  | invalidRequestWarning |
| 0x495643 | IVC  | inviteCreate          |
| 0x495644 | IVD  | inviteDelete          |
| 0x4D5343 | MSC  | messageCreate         |
| 0x4D5344 | MSD  | messageDelete         |
| 0x4D5355 | MSU  | messageUpdate         |
| 0x505355 | PSU  | presenceUpdate        |
| 0x524459 | RDY  | ready                 |
| 0x545053 | TPS  | typingStart           |
| 0x565355 | VSU  | voiceStateUpdate      |
| 0x57524E | WRN  | warn                  |

<br>

## Commands

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
|  -1   | /test      | -           | -                           |
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

### cra - subcommands

|  PL*  | Command    | Parameters* | Description        |
| :---: | ---------- | ----------- | ------------------ |
|   —   | /cra roles | —           | Self-select roles. |
