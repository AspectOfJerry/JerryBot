# JerryBot

JerryBot is a Discord bot for personal use built on DiscordJS v13. Its predecessor, built on DiscordJS v12, can be found in [this repository](https://github.com/AspectOfJerry/DiscordBot-OBSOLETE).

Create a file named `.env` in the root of this project with all the API keys/tokens needed.

For more information, please refer to the [documentation](https://bot.jerrydev.net).

## Scripts

coming soon when i have the patience to write this section

## Developer reference

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
| 0x494352 | ICR  | interactionCreate     |
| 0x495257 | IRW  | invalidRequestWarning |
| 0x495643 | IVC  | inviteDelete          |
| 0x495644 | IVD  | inviteDelete          |
| 0x4D5343 | MSC  | messageCreate         |
| 0x4D5344 | MSD  | messageDelte          |
| 0x4D5355 | MSU  | messageUpdate         |
| 0x505355 | PSU  | presenceUpdate        |
| 0x524459 | RDY  | ready                 |
| 0x545053 | TPS  | typingStart           |
| 0x565355 | VSU  | voiceStateUpdate      |
| 0x57524E | WRN  | warn                  |

<br>

### Exception messages

Clarifications:
> Invalid: "Invalid" typically implies that something is not valid or acceptable based on defined criteria or rules. It suggests that the object or value does not meet the required conditions or expectations.
> *OpenAI ChatGPT*

> Incorrect: "Incorrect" indicates that something is not accurate or right in relation to a particular context or expectation. It suggests that the object or value is not correct or appropriate in the given situation.
> *OpenAI ChatGPT*

| Name                            | Context                                    |
| ------------------------------- | ------------------------------------------ |
| IllegalVoiceStateException      | User's voice state is not suitable         |
| InvalidArgumentTypeException    | Incorrect argument type                    |
| InsufficientPermissionException | Insufficient permissions for *any*         |
| Self{action}Exception           | User cannot perform *action* on themselves |
| IllegalArgumentException        | Invalid argument provided                  |
| ResolveException                | Unable to resolve or find *any*            |
| RequestFailureException         | Failed to perform or fetch *any*           |

<br>

### Logger formats

| Name              | Example                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Command execution | find in `root/events/interactionCreate.js`                                                                                    |
| Command info      | `logger.append("info", "STDOUT", "'/command' > Hello, World!");`                                                                |
| Role exception    | `logger.append("notice", "STDOUT", "'/command' > [InsufficientPermissionException] on role compare, '@user1' EQUAL '@user2'");` |
