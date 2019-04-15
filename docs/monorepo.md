# rearguard monorepo

Tool to work with [**"mono repository"**](https://gitlab.com/mitya-borodin/base-code). These are repositories that include several projects.

This tool is needed to perform group actions on all packages within this repository.

Since packages have dependencies on each other, then you need to perform actions in a strict order, from independent to those with the largest number of dependencies.

In order to understand in what order to perform the actions, it is necessary to go into each module and build [**sync_project_deps**](https://gitlab.com/mitya-borodin/rearguard/blob/master/docs/sync_project_deps.md).
Then you can perform actions on the modules in the correct order.

And so, we have a list of modules for which you need to go. Next, go to the available actions.

## Actions

### rearguard monorepo --init

- A configuration file monorepo.json is created, which indicates in which directory the modules are located.
- File is created .gitignore

### rearguard monorepo --install

- Passes through the modules and runs the npm install script, in synchronous mode.

### rearguard monorepo --build

- Passes through the modules and runs the npm run build script, in synchronous mode.

### rearguard monorepo --link

- Passes through the modules and runs the npm link script, in synchronous mode.

### rearguard monorepo --bootstrap

- Passes through the modules and runs a set of scripts (clear, npm install, npm run build, npm run link), in synchronous mode.

### rearguard monorepo --build --release | -r

- Passes through the modules and runs the script npm run build: both, in synchronous mode.

### rearguard monorepo --test

- Passes through the modules and runs the npm run test script, in synchronous mode.

### rearguard monorepo --publish [ --patch | --minor | --major ]

- Passes through all modules, updates the version depending on the flag. The default is the --patch flag. Then npm publish is executed.
