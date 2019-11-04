# Rearguard

- [What is it rearguard ?](#whatIsIt)
- [Technology](#tech)
- [Install](#install)
- [CLI](#cli)

<a name="whatIsIt"></a>

## What is it rearguard

<a name="tech"></a>

### Technology

<a name="cli"></a>

## CLI

### Project Initialization / Refresh

- rearguard init browser app [ --force ]
- rearguard init browser dll [ --force ]
- rearguard init browser lib [ --force ]
- rearguard init isomorphic [ --force ]
- rearguard init node lib [ --force ]
- rearguard init node app [ --force ]
- rearguard refresh [ --force ]

### Develop mode

- rearguard start [ --release | --debug | --ts_node_dev ]

### Build mode

- rearguard build [ --only_dev | --debug ]

### Testing mode

- rearguard test [ --debug ]

### Validating

- rearguard lint [ --fix ]

### Group service

- rearguard group bootstrap [ --force | --only_dev | --debug ]
- rearguard group clear
- rearguard group init [ --force ]
- rearguard group install
- rearguard group build [ --only_dev | --debug ]
- rearguard group link
- rearguard group test [ --debug ]
- rearguard group publish [ --patch | --minor | --major ]
- rearguard group reInit [ --force ]

<a name="install"></a>

## Install

Globally, for use in multiple projects.

```sh
npm install -g rearguard
```

Locally, in the project and saving the exact version.

```sh
npm install -D rearguard
```

## Documentation

- [English](./docs/en/index.md)
- [Русский](./docs/ru/index.md)
