# Project: Idle Takeover

## About

Project: Idle Takeover is an idle management game, heavily inspired by [Bitburner](https://github.com/bitburner-official/bitburner-src), in which player controls AI on mainframe and group of clones to collect intel. Player visits different cities, which cover different scenarios, and by working for various factions unlocks new features. Mainframe provides various support buffs, performs hacking and automates gameplay while clones perform sidejobs, contracts and operations.

Project: Idle Takeover is currenly under development. It has roadmap available but info here may be outdated.

Discord for discussions and feedback is available here: https://discord.gg/CmsTxU2EMw

## Local development and contribution

Currently, game doesn't have development page but it can be ran locally. To start development server, install dependencies first by running this command:

```
npm i
```

and then run following command in console:

```
npm run dev
```

Game uses [Lit](https://github.com/lit/lit) and [Shoelace](https://github.com/shoelace-style/shoelace) for frontend. Unit tests for state and UI are planned but currently on hold.

Before commiting changes, run following commands to fix formatting and find linting issues:

```
npm run wca
npm run prettier
npm run lint
```

For translactions, game uses [@lit/localize](https://github.com/Lit/Lit/tree/main/packages/localize). To update localization, first run `localize:extract`, then update xlf file under `src/xliff` directory, then run `localize:build`.
