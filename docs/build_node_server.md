# rearguard build_node_server

The build procedure of the server project is taken over the rearguard control in order to control the launch configuration and environment.

Runs all necessary procedures:

- Write configuration files.
- Install the required dependencies.
- Synchronization with global modules.
- Run tslint;
- Build via tsc.

```javascript
spawn.sync(
  "tsc",
  [
    "--project",
    path.resolve(process.cwd(), "tsconfig.json"),
    "--rootDir",
    path.resolve(process.cwd(), ""),
    "--outDir",
    path.resolve(process.cwd(), "dist"),
    "--module",
    "commonjs",
  ],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "inherit",
  },
);
```

- Preparing the `dist` directory to build a docker image.
- The output of commands prompts to create an image and its deployment.
