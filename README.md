# Discord-JerryBot
Do not contribute.
## JerryBot
JerryBot is a Discord bot for personal use built on DiscordJS v13. Its predecessor, built on DiscordJS v12, can be found in [this repository](https://github.com/AspectOfJerry/DiscordBot-OBSOLETE).
## Repository file structure summary

<!--│, ─, ├─, └─-->

```
[Repo]
├─ commands                     -> command files
│  ├─ api                       <-
│  │  ├─ hypixel_subcommands
│  │  │  ├─ hypixel.subcmd_hdlr.js
│  │  │  ├─ [...] .subcmd.js
│  │  ├─ nasa_subcommands
│  │  │  ├─ nasa.subcmd_hdlr.js
│  │  │  ├─ [...] .subcmd.js
│  │  ├─ [...] .js
│  ├─ client                    <-
│  │  ├─ info.js
│  │  ├─ ping.js
│  │  ├─ status.js
│  │  └─ stop.js
│  ├─ config                    <-
│  │  └─ config_subcommands
│  │     ├─ config.subcmd_hdlr.js
│  │     ├─ [...] .subcmd.js
│  ├─ dev                       <-
│  │  └─ dev_subcommands
│  │     ├─ dev.subcmd_hdlr.js
│  │     ├─ [...] .subcmd.js
│  ├─ local
│  │  ├─ log_subcommands
│  │  │  ├─ logs.subcmd_hdlr.js
│  │  │  ├─ [...] .subcmd.js
│  │  ├─ stats_subcommand
│  │  │  ├─ stats.subcmd_hdlr.js
│  │  │  ├─ [...] .subcmd.js
│  │  ├─ [...] .js
│  ├─ moderation
│  ├─ [...] .js
│  ├─ other                     <-
│  │  ├─ 311                    -> exclusive commands
│  │  │  ├─ database
│  │  │  │  ├─ dbms.js
│  │  │  │  ├─ [...] .json
│  │  │  ├─ 311.subcmd_hdlr.js
│  │  │  ├─ [...] .subcmd.js
│  │  ├─ [...] .js
│  ├─ testing                   <-
│  │  └─ test.test.js
│  └─ utility                   <-
│     ├─ voice_subcommands
│     │  ├─ voice.subcmd_hdlr.js
│     │  ├─ voice_deaf.subcmd.js
│     │  ├─ voice_join.subcmd.js
│     │  ├─ voice_leave.subcmd.js
│     │  └─ voice_mute.subcmd.js
│     ├─ [...] .js
├─ events                       -> event files
│  ├─ [...] .js
├─ jobs                         -> cron jobs
│  ├─ heartbeat.js
│  ├─ [...] .js
├─ logs                         -> logs output directory
│  ├─ digest
│  │  ├─ .gitignore
│  │  ├─ [...] .log
│  ├─ .gitignore
│  ├─ [...] .log
├─ modules                      -> custom functions "modules"
│  ├─ get_files.js
│  ├─ logger.js
│  ├─ sleep.js
│  ├─ start_jobs.js
│  └─ system_monitor.js
├─ templates                    -> code template files
│  ├─ [...] .template.js
├─ .env.template                -> empty .env template file
├─ .gitignore
├─ README.md
├─ index.js                     -> entrypoint
├─ package-lock.json
├─ package.json
└─ run.cmd
```