# rearguard build_node_server

Процедура сборки серверного проекта взята по контроль rearguard для того, чтобы контролировать конфигураци запуска и окружения.

Фактически выполняется синхронное создание процесса:

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
