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
│  │  ├─ aspectofjerry
│  │  │  ├─ [...] .js
│  │  ├─ hypixel_subcommands
│  │  │  ├─ [...] .subcmd.js
│  │  │  └─ hypixel.subcmd_hdlr.js
│  │  ├─ nasa_subcommands
│  │  │  ├─ [...] .subcmd.js
│  │  │  └─ nasa.subcmd_hdlr.js
│  │  ├─ [...] .js
│  ├─ client                    <-
│  │  ├─ ping.js
│  │  ├─ status.js
│  │  └─ stop.js
│  ├─ config                    <-
│  │  ├─ config_subcommands
│  │  │  ├─ [...] .subcmd.js
│  │  │  └─ config.subcmd_hdlr.js
│  ├─ dev                       <-
│  │  └─ dev_subcommands
│  │     ├─ [...] .subcmd.js
│  │     └─ dev.subcmd_hdlr.js
│  ├─ local
│  │  ├─ log_subcommands
│  │  │  ├─ [...] .subcmd.js
│  │  │  └─ logs.subcmd_hdlr.js
│  │  ├─ stats_subcommand
│  │  │  ├─ [...] .subcmd.js
│  │  │  └─ stats.subcmd_hdlr.js
│  │  ├─ [...] .js
│  ├─ moderation
│  ├─ [...] .js
│  ├─ other                     <-
│  │  ├─ 311                    -> exclusive commands
│  │  │  ├─ database
│  │  │  │  ├─ dbms.js
│  │  │  │  ├─ [...] .json
│  │  │  ├─ [...] .subcmd.js
│  │  │  └─ 311.subcmd_hdlr.js
│  │  ├─ [...] .js
│  ├─ testing                   <-
│  │  ├─ test.test.js
│  └─ utility                   <-
│     ├─ voice_subcommands
│     │  ├─ voice_deaf.subcmd.js
│     │  ├─ voice_join.subcmd.js
│     │  ├─ voice_leave.subcmd.js
│     │  ├─ voice_mute.subcmd.js
│     │  └─ voice.subcmd_hdlr.js
│     ├─ [...] .js
├─ events
│  ├─ [...] .js
├─ jobs                         -> cron jobs
│  ├─ heartbeat.js
│  ├─ [...] .js
├─ logs                         -> logs output
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
├─ templates
│  ├─ [...] template.js
├─ .env.template                -> empty .env template
├─ .gitignore
├─ README.md
├─ index.js                     -> entrypoint
├─ package-lock.json
├─ package.json
└─ run.cmd
```