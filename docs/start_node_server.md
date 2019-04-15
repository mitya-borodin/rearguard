# rearguard start_node_server

The build procedure of the server project is taken over the rearguard control in order to control the launch configuration and environment.

Runs all necessary procedures:

- Write configuration files.
- Install the required dependencies.
- Synchronization with global modules.
- Run tslint;
- Run process via ts-node-dev:

```javascript
spawn.sync("ts-node-dev", ["--prefer-ts", "--type-check", "--respawn", "./bin/www.ts"], {
  encoding: "utf8",
  stdio: "inherit",
});
```
